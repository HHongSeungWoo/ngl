/**
 * @file Dxbin Parser
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */

import { Debug, Log, ParserRegistry } from '../globals'
import { ensureBuffer, uint8ToString } from '../utils'
import DxParser from './dx-parser'

function uint8ToLines (u8a: Uint8Array, chunkSize = 1024 * 1024 * 10, newline = '\n') {
  let partialLine = ''
  let lines: string[] = []

  for (let i = 0; i < u8a.length; i += chunkSize) {
    const str = uint8ToString(u8a.subarray(i, i + chunkSize))
    const idx = str.lastIndexOf(newline)

    if (idx === -1) {
      partialLine += str
    } else {
      const str2 = partialLine + str.substr(0, idx)
      lines = lines.concat(str2.split(newline))

      if (idx === str.length - newline.length) {
        partialLine = ''
      } else {
        partialLine = str.substr(idx + newline.length)
      }
    }
  }

  if (partialLine !== '') {
    lines.push(partialLine)
  }

  return lines
}

class DxbinParser extends DxParser {
  get type () { return 'dxbin' }
  get isBinary () { return true }

  _parse () {
    // https://github.com/Electrostatics/apbs-pdb2pqr/issues/216

    if (Debug) Log.time('DxbinParser._parse ' + this.name)

    const bin = ensureBuffer(this.streamer.data)
    const headerLines = uint8ToLines(new Uint8Array(bin, 0, 1000))
    const headerInfo = this.parseHeaderLines(headerLines)
    const header = this.volume.header
    const headerByteCount = headerInfo.headerByteCount

    const size = header.nx * header.ny * header.nz
    const dv = new DataView(bin)
    const data = new Float32Array(size)

    for (let i = 0; i < size; ++i) {
      data[ i ] = dv.getFloat64(i * 8 + headerByteCount, true)
    }

    this.volume.setData(data, header.nz, header.ny, header.nx)

    if (Debug) Log.timeEnd('DxbinParser._parse ' + this.name)
  }
}

ParserRegistry.add('dxbin', DxbinParser)

export default DxbinParser
