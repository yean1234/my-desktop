/*
 * This file is for deciding which local files should use the image icon.
 */
const imageFileExtensions = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'])

const readFileExtension = (fileName: string) => {
  const extensionStartIndex = fileName.lastIndexOf('.')

  if (extensionStartIndex < 0 || extensionStartIndex === fileName.length - 1) {
    return ''
  }

  return fileName.slice(extensionStartIndex + 1).toLowerCase()
}

export const usesImageFileIcon = (fileName: string) =>
  imageFileExtensions.has(readFileExtension(fileName))
