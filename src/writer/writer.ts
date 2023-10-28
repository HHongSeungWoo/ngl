/**
 * @file Writer
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */

/**
 * Base class for writers
 * @interface
 */
abstract class Writer {
  readonly mimeType: string
  readonly defaultName: string
  readonly defaultExt: string

  /**
   * @abstract
   * @return {Anything} the data to be written
   */
  abstract getData (): any

  /**
   * Get a blob with the written data
   * @return {Blob} the blob
   */
  getBlob () {
    return new Blob([ this.getData() ], { type: this.mimeType })
  }
}

export default Writer