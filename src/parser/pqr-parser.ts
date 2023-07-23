/**
 * @file Pqr Parser
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */

import PdbParser from './pdb-parser'

// http://www.poissonboltzmann.org/docs/file-format-info/

class PqrParser extends PdbParser {
  get type () { return 'pqr' }
}



export default PqrParser
