/**
 * @file Utils
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */

import { Vector2, Vector3, Matrix4, Quaternion } from 'three'

export function getQuery (id: string) {
  if (typeof window === 'undefined') return undefined

  const a = new RegExp(`${id}=([^&#=]*)`)
  const m = a.exec(window.location.search)

  if (m) {
    return decodeURIComponent(m[1])
  } else {
    return undefined
  }
}

export function boolean (value: any) {
  if (!value) {
    return false
  }

  if (typeof value === 'string') {
    return /^1|true|t|yes|y$/i.test(value)
  }

  return true
}

export function defaults (value: any, defaultValue: any) {
  return value !== undefined ? value : defaultValue
}

export function createParams<T> (params: {[k in keyof T]?: any}, defaultParams: T) {
  const o: any = Object.assign({}, params)
  for (const k in defaultParams) {
    const value = params[k]
    if (value === undefined) o[k] = defaultParams[k]
  }
  return o as T
}

export function updateParams<T> (params: T, newParams: {[k in keyof T]?: any}) {
  for (const k in newParams) {
    const value = newParams[k]
    if (value !== undefined) params[k] = value
  }
  return params as T
}

export function getProtocol () {
  const protocol = window.location.protocol
  return protocol.match(/http(s)?:/gi) === null ? 'http:' : protocol
}

export function getAbsolutePath (relativePath: string) {
  const loc = window.location
  const pn = loc.pathname
  const basePath = pn.substring(0, pn.lastIndexOf('/') + 1)

  return loc.origin + basePath + relativePath
}


export function lexicographicCompare<T> (elm1: T, elm2: T) {
  if (elm1 < elm2) return -1
  if (elm1 > elm2) return 1
  return 0
}

/**
 * Does a binary search to get the index of an element in the input array
 * @function
 * @example
 * var array = [ 1, 2, 3, 4, 5, 6 ];
 * var element = 4;
 * binarySearchIndexOf( array, element );  // returns 3
 *
 * @param {Array} array - sorted array
 * @param {Anything} element - element to search for in the array
 * @param {Function} [compareFunction] - compare function
 * @return {Number} the index of the element or -1 if not in the array
 */
export function binarySearchIndexOf<T> (array: T[], element: T, compareFunction = lexicographicCompare) {
  let low = 0
  let high = array.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    const cmp = compareFunction(element, array[ mid ])
    if (cmp > 0) {
      low = mid + 1
    } else if (cmp < 0) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return -low - 1
}

export function binarySearchForLeftRange (array: number[], leftRange: number) {
  let high = array.length - 1
  if (array[ high ] < leftRange) return -1
  let low = 0
  while (low <= high) {
    const mid = (low + high) >> 1
    if (array[ mid ] >= leftRange) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  return high + 1
}

export function binarySearchForRightRange (array: number[], rightRange: number) {
  if (array[ 0 ] > rightRange) return -1
  let low = 0
  let high = array.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (array[ mid ] > rightRange) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  return low - 1
}

export function rangeInSortedArray (array: number[], min: number, max: number) {
  const indexLeft = binarySearchForLeftRange(array, min)
  const indexRight = binarySearchForRightRange(array, max)
  if (indexLeft === -1 || indexRight === -1 || indexLeft > indexRight) {
    return 0
  } else {
    return indexRight - indexLeft + 1
  }
}

export function uniqueArray (array: any[]) {
  return array.sort().filter(function (value, index, sorted) {
    return (index === 0) || (value !== sorted[ index - 1 ])
  })
}

// String/arraybuffer conversion

export function uint8ToString (u8a: Uint8Array) {
  const chunkSize = 0x7000

  if (u8a.length > chunkSize) {
    const c = []

    for (let i = 0; i < u8a.length; i += chunkSize) {
      c.push(String.fromCharCode.apply(
        null, u8a.subarray(i, i + chunkSize)
      ))
    }

    return c.join('')
  } else {
    return String.fromCharCode.apply(null, u8a)
  }
}

export type TypedArrayString = 'int8'|'int16'|'int32'|'uint8'|'uint16'|'uint32'|'float32'
export function getTypedArray (arrayType: TypedArrayString, arraySize: number) {
  switch (arrayType) {
    case 'int8':
      return new Int8Array(arraySize)
    case 'int16':
      return new Int16Array(arraySize)
    case 'int32':
      return new Int32Array(arraySize)
    case 'uint8':
      return new Uint8Array(arraySize)
    case 'uint16':
      return new Uint16Array(arraySize)
    case 'uint32':
      return new Uint32Array(arraySize)
    case 'float32':
      return new Float32Array(arraySize)
    default:
      throw new Error('arrayType unknown: ' + arrayType)
  }
}

export function getUintArray (sizeOrArray: any, maxUint: number) {  // TODO
  const TypedArray = maxUint > 65535 ? Uint32Array : Uint16Array
  return new TypedArray(sizeOrArray)
}

export function ensureArray (value: any) {
  return Array.isArray(value) ? value : [value]
}

export function ensureBuffer (a: any) {  // TODO
  return (a.buffer && a.buffer instanceof ArrayBuffer) ? a.buffer : a
}

function _ensureClassFromArg (arg: any, constructor: { new (arg: any): any }) {
  return arg instanceof constructor ? arg : new constructor(arg)
}

function _ensureClassFromArray (array: any, constructor: { new (): any }) {
  if (array === undefined) {
    array = new constructor()
  } else if (Array.isArray(array)) {
    array = new constructor().fromArray(array)
  }
  return array
}

export function ensureVector2 (v?: number[]|Vector2) {
  return _ensureClassFromArray(v, Vector2)
}

export function ensureVector3 (v?: number[]|Vector3) {
  return _ensureClassFromArray(v, Vector3)
}

export function ensureMatrix4 (m?: number[]|Matrix4) {
  return _ensureClassFromArray(m, Matrix4)
}

export function ensureQuaternion (q?: number[]|Quaternion) {
  return _ensureClassFromArray(q, Quaternion)
}

export function ensureFloat32Array (a?: number[]|Float32Array) {
  return _ensureClassFromArg(a, Float32Array)
}

export interface RingBuffer<T> {
  has: (value: T) => boolean
  get: (value: number) => T
  push: (value: T) => void
  count: number
  data: T[]
  clear: () => void
}

export function createRingBuffer<T> (length: number): RingBuffer<T> {
  let pointer = 0
  let count = 0
  const buffer: T[] = []

  return {
    has: function (value: any) { return buffer.indexOf(value) !== -1 },
    get: function (idx: number) { return buffer[idx] },
    push: function (item: any) {
      buffer[pointer] = item
      pointer = (length + pointer + 1) % length
      ++count
    },
    get count () { return count },
    get data () { return buffer.slice(0, Math.min(count, length)) },
    clear: function () {
      count = 0
      pointer = 0
      buffer.length = 0
    }
  }
}

export interface SimpleDict<K, V> {
  has: (k: K) => boolean
  add: (k: K, v: V) => void
  del: (k: K) => void
  values: V[]
}

export function createSimpleDict<K, V> (): SimpleDict<K, V> {
  const set: { [k: string]: V } = {}

  return {
    has: function (k: K) { return set[JSON.stringify(k)] !== undefined },
    add: function (k: K, v: V) { set[JSON.stringify(k)] = v },
    del: function (k: K) { delete set[JSON.stringify(k)] },
    get values () { return Object.keys(set).map(k => set[k]) }
  }
}