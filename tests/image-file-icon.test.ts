import { describe, expect, it } from 'vitest'
import { usesImageFileIcon } from '../src/utils/imageFileIcon'

describe('image file icon rules', () => {
  it('uses the image icon for common image extensions', () => {
    expect(usesImageFileIcon('photo.png')).toBe(true)
    expect(usesImageFileIcon('cover.jpg')).toBe(true)
    expect(usesImageFileIcon('scan.jpeg')).toBe(true)
    expect(usesImageFileIcon('animation.gif')).toBe(true)
  })

  it('matches image extensions without caring about letter case', () => {
    expect(usesImageFileIcon('POSTER.PNG')).toBe(true)
    expect(usesImageFileIcon('PHOTO.JPG')).toBe(true)
  })

  it('keeps the generic file icon for non-image files', () => {
    expect(usesImageFileIcon('notes.txt')).toBe(false)
    expect(usesImageFileIcon('archive.zip')).toBe(false)
    expect(usesImageFileIcon('folder')).toBe(false)
  })
})
