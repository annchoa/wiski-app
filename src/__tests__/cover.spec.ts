import { describe, expect, it } from 'vitest'
import { colorSchemes, defaultColorScheme } from '../lib/colorSchemes'
import { createCover, illustrationElementId } from '../lib/cover'
import { defaultIllustration, type Illustration } from '../lib/illustrations'
import { letterSizeInPt } from '../lib/letterSize'
import { defaultTypeface, typefaces } from '../lib/typefaces'

function otherTypeface() {
	const other = typefaces.find(({ name }) => name !== defaultTypeface.name)
	if (!other) throw new Error('only one Typeface')
	return other
}

function otherColorScheme() {
	const other = colorSchemes.find(
		({ background }) => background !== defaultColorScheme.background,
	)
	if (!other) throw new Error('only one Color scheme')
	return other
}

// A Moment sheet: 20 cm wide and 28 cm high, so 1.4 times its width.
const sheetHeight = 1.4
const sheetWidthCm = 20

function aCover() {
	return createCover({
		title: 'Mi destino favorito',
		dateLine: 'noviembre 2026',
		sheetHeight,
		sheetWidthCm,
	})
}

const largeIllustration: Illustration = {
	id: 'large',
	size: 'large',
	width: 800,
	height: 450,
}
const smallIllustration: Illustration = {
	id: 'small',
	size: 'small',
	width: 30,
	height: 60,
}

function illustrationOf(cover: ReturnType<typeof aCover>, index: number) {
	const illustration = cover.illustrations[index]
	if (!illustration) throw new Error(`Illustration ${index} is missing`)
	return illustration
}

function titleOf(cover: ReturnType<typeof aCover>) {
	if (!cover.title) throw new Error('the Title is missing')
	return cover.title
}

describe('Cover model', () => {
	it('starts with the given texts, the first Color scheme and nothing selected', () => {
		const cover = aCover()

		expect(cover.title?.text).toBe('Mi destino favorito')
		expect(cover.dateLine?.text).toBe('noviembre 2026')
		expect(cover.colorScheme).toEqual(defaultColorScheme)
		expect(cover.selected).toBeNull()
	})

	it('removes the selected text and clears the selection', () => {
		const cover = aCover()

		cover.select('title')
		cover.deleteSelected()

		expect(cover.title).toBeNull()
		expect(cover.dateLine?.text).toBe('noviembre 2026')
		expect(cover.selected).toBeNull()
	})

	it('changes the Color scheme', () => {
		const cover = aCover()

		const other = otherColorScheme()

		cover.setColorScheme(other)

		expect(cover.colorScheme).toEqual(other)
	})

	it('gives a new Typeface to the selected text only', () => {
		const cover = aCover()
		const other = otherTypeface()

		cover.select('title')
		cover.setTypeface(other.name)

		expect(cover.title?.typeface).toBe(other.name)
		expect(cover.dateLine?.typeface).toBe(defaultTypeface.name)
	})

	it('ignores a new Typeface while no text is selected', () => {
		const cover = aCover()
		const other = otherTypeface()

		cover.select(illustrationElementId(0))
		cover.setTypeface(other.name)

		expect(cover.title?.typeface).toBe(defaultTypeface.name)
		expect(cover.dateLine?.typeface).toBe(defaultTypeface.name)
	})

	it('starts both texts with the same style', () => {
		const cover = aCover()

		for (const text of [cover.title, cover.dateLine]) {
			expect(text).toMatchObject({
				lineSpacing: 1.2,
				letterSpacing: 0,
				underline: false,
				strikethrough: false,
				alignment: 'center',
			})
		}
	})

	it('sets the Letter size in pt and keeps it between 8 and 150 pt', () => {
		const cover = aCover()
		const title = titleOf(cover)

		cover.setLetterSize('title', 72)
		expect(letterSizeInPt(title.letterSize, sheetWidthCm)).toBe(72)

		cover.setLetterSize('title', 3)
		expect(letterSizeInPt(title.letterSize, sheetWidthCm)).toBe(8)

		cover.setLetterSize('title', 500)
		expect(letterSizeInPt(title.letterSize, sheetWidthCm)).toBe(150)
	})

	it('changes the Letter size of one text only', () => {
		const cover = aCover()
		const { letterSize } = cover.dateLine ?? { letterSize: 0 }

		cover.setLetterSize('title', 72)

		expect(cover.dateLine?.letterSize).toBe(letterSize)
	})

	it('keeps the Line spacing between 0.8 and 2', () => {
		const cover = aCover()
		const title = titleOf(cover)

		cover.setLineSpacing('title', 1.5)
		expect(title.lineSpacing).toBe(1.5)

		cover.setLineSpacing('title', 0.1)
		expect(title.lineSpacing).toBe(0.8)

		cover.setLineSpacing('title', 5)
		expect(title.lineSpacing).toBe(2)
		expect(cover.dateLine?.lineSpacing).toBe(1.2)
	})

	it('keeps the Letter spacing between -100 and 500', () => {
		const cover = aCover()
		const title = titleOf(cover)

		cover.setLetterSpacing('title', 40)
		expect(title.letterSpacing).toBe(40)

		cover.setLetterSpacing('title', -900)
		expect(title.letterSpacing).toBe(-100)

		cover.setLetterSpacing('title', 900)
		expect(title.letterSpacing).toBe(500)
		expect(cover.dateLine?.letterSpacing).toBe(0)
	})

	it('toggles Underline and Strikethrough for one text', () => {
		const cover = aCover()
		const title = titleOf(cover)

		cover.toggleUnderline('title')
		cover.toggleStrikethrough('title')
		expect(title.underline).toBe(true)
		expect(title.strikethrough).toBe(true)
		expect(cover.dateLine?.underline).toBe(false)

		cover.toggleUnderline('title')
		expect(title.underline).toBe(false)
		expect(title.strikethrough).toBe(true)
	})

	it('cycles the Alignment: center, right, left, center', () => {
		const cover = aCover()
		const title = titleOf(cover)

		cover.cycleAlignment('title')
		expect(title.alignment).toBe('right')
		cover.cycleAlignment('title')
		expect(title.alignment).toBe('left')
		cover.cycleAlignment('title')
		expect(title.alignment).toBe('center')
		expect(cover.dateLine?.alignment).toBe('center')
	})

	it('keeps the style when the Typeface or the Color scheme change', () => {
		const cover = aCover()
		const title = titleOf(cover)
		cover.setLetterSize('title', 72)
		cover.toggleUnderline('title')
		cover.select('title')

		cover.setTypeface(otherTypeface().name)
		cover.setColorScheme(otherColorScheme())

		expect(letterSizeInPt(title.letterSize, sheetWidthCm)).toBe(72)
		expect(title.underline).toBe(true)
	})

	it('moves a text up when its new height passes the bottom of the sheet', () => {
		const cover = aCover()
		cover.setTextHeight('title', 0.1)
		cover.moveTo('title', { x: 0.1, y: sheetHeight - 0.1 })

		cover.setTextHeight('title', 0.3)

		expect(titleOf(cover).y).toBeCloseTo(sheetHeight - 0.3)
	})

	it('keeps a moved text inside the sheet', () => {
		const cover = aCover()
		cover.setTextHeight('title', 0.1)

		cover.moveTo('title', { x: 5, y: 5 })

		const title = titleOf(cover)
		expect(title.x + title.width).toBeCloseTo(1)
		expect(title.y + 0.1).toBeCloseTo(sheetHeight)

		cover.moveTo('title', { x: -5, y: -5 })

		expect(title.x).toBe(0)
		expect(title.y).toBe(0)
	})

	it('scales the letters of a text in proportion to its new width', () => {
		const cover = aCover()
		const title = titleOf(cover)
		const { width, letterSize } = title

		cover.scaleText('title', { x: 0.2, y: 0.1, width: width / 2 })

		expect(title.width).toBeCloseTo(width / 2)
		expect(title.letterSize).toBeCloseTo(letterSize / 2)
		expect(title.x).toBe(0.2)
		expect(title.y).toBe(0.1)
	})

	it('stops a corner Handle when the letters reach 8 pt', () => {
		const cover = aCover()
		const title = titleOf(cover)
		const { width, letterSize } = title

		cover.scaleText('title', { x: 0.2, y: 0.1, width: 0.11 })

		expect(letterSizeInPt(title.letterSize, sheetWidthCm)).toBe(8)
		// The letters and the box still grow together.
		expect(title.width / title.letterSize).toBeCloseTo(width / letterSize)
	})

	it('changes the width of a text without changing its letters', () => {
		const cover = aCover()
		const title = titleOf(cover)
		const { letterSize } = title

		cover.resizeTextWidth('title', { x: 0.3, width: 0.4 })

		expect(title.width).toBe(0.4)
		expect(title.x).toBe(0.3)
		expect(title.letterSize).toBe(letterSize)
	})

	it('stops a text at a minimum width and at the edge of the sheet', () => {
		const cover = aCover()
		const title = titleOf(cover)

		cover.resizeTextWidth('title', { x: 0.3, width: 0.001 })
		expect(title.width).toBeGreaterThan(0.05)

		cover.resizeTextWidth('title', { x: 0.3, width: 5 })
		expect(title.x).toBe(0)
		expect(title.width).toBe(1)

		cover.scaleText('title', { x: 0.3, y: 0.1, width: 5 })
		expect(title.x).toBe(0)
		expect(title.width).toBe(1)
	})

	it('replaces the text of the Title', () => {
		const cover = aCover()

		cover.setText('title', 'Nuestro viaje a Cuenca')

		expect(cover.title?.text).toBe('Nuestro viaje a Cuenca')
		expect(cover.dateLine?.text).toBe('noviembre 2026')
	})

	it('keeps the old text when the new one is empty', () => {
		const cover = aCover()

		cover.setText('title', '')
		cover.setText('dateLine', '   ')

		expect(cover.title?.text).toBe('Mi destino favorito')
		expect(cover.dateLine?.text).toBe('noviembre 2026')
	})

	it('starts with the default Illustration, with its proportion', () => {
		const cover = aCover()

		expect(cover.illustrations).toHaveLength(1)
		const illustration = illustrationOf(cover, 0)
		expect(illustration.id).toBe(defaultIllustration.id)
		expect(illustration.width / illustration.height).toBeCloseTo(860 / 751)
	})

	it('adds an Illustration in the center, on top of the others, and selects it', () => {
		const cover = aCover()

		cover.addIllustration(largeIllustration)

		expect(cover.illustrations).toHaveLength(2)
		const added = illustrationOf(cover, 1)
		expect(added.id).toBe('large')
		expect(added.x + added.width / 2).toBeCloseTo(0.5)
		expect(added.y + added.height / 2).toBeCloseTo(sheetHeight / 2)
		expect(cover.selected).toBe(illustrationElementId(added.key))
	})

	it('adds the same Illustration twice as two different ones', () => {
		const cover = aCover()

		cover.addIllustration(largeIllustration)
		cover.addIllustration(largeIllustration)

		const [, first, second] = cover.illustrations
		expect(first?.id).toBe('large')
		expect(second?.id).toBe('large')
		expect(first?.key).not.toBe(second?.key)
	})

	it('starts a small Illustration as an icon of about 30 px on a 540 px sheet', () => {
		const cover = aCover()

		cover.addIllustration(smallIllustration)

		const added = illustrationOf(cover, 1)
		const icon = 30 / 540
		expect(added.height).toBeCloseTo(icon)
		expect(added.width).toBeCloseTo(icon / 2)
	})

	// 600 px print sharp up to 600 / 150 ppi = 4 in = 10.16 cm, half of a 20 cm sheet.
	const photoIllustration: Illustration = {
		id: 'photo',
		size: 'large',
		width: 600,
		height: 400,
		extension: 'png',
	}
	const sharpWidth = ((600 / 150) * 2.54) / sheetWidthCm

	it('starts a PNG Illustration at the widest size that still prints sharp', () => {
		const cover = aCover()

		cover.addIllustration(photoIllustration)

		expect(illustrationOf(cover, 1).width).toBeCloseTo(sharpWidth)
	})

	it('starts a PNG Illustration with more pixels than the sheet needs at the sheet width', () => {
		const cover = aCover()

		cover.addIllustration({ ...photoIllustration, width: 3000, height: 3000 })

		expect(illustrationOf(cover, 1).width).toBe(1)
	})

	it('does not let a PNG Illustration grow past the size that prints sharp', () => {
		const cover = aCover()
		cover.addIllustration(photoIllustration)
		const added = illustrationOf(cover, 1)

		cover.scaleIllustration(added.key, { x: 0, y: 0, width: 0.9 })

		expect(added.width).toBeCloseTo(sharpWidth)
	})

	it('lets a PNG Illustration shrink', () => {
		const cover = aCover()
		cover.addIllustration(photoIllustration)
		const added = illustrationOf(cover, 1)

		cover.scaleIllustration(added.key, { x: 0, y: 0, width: 0.2 })

		expect(added.width).toBeCloseTo(0.2)
	})

	it('lets an SVG Illustration grow to the sheet width', () => {
		const cover = aCover()
		cover.addIllustration(largeIllustration)
		const added = illustrationOf(cover, 1)

		cover.scaleIllustration(added.key, { x: 0, y: 0, width: 1 })

		expect(added.width).toBe(1)
	})

	it('scales an Illustration and keeps its proportion', () => {
		const cover = aCover()
		const illustration = illustrationOf(cover, 0)
		const proportion = illustration.width / illustration.height

		cover.scaleIllustration(illustration.key, { x: 0.2, y: 0.3, width: 0.5 })

		expect(illustration.x).toBe(0.2)
		expect(illustration.y).toBe(0.3)
		expect(illustration.width).toBe(0.5)
		expect(illustration.width / illustration.height).toBeCloseTo(proportion)
	})

	it('removes the selected Illustration and keeps the others, down to none', () => {
		const cover = aCover()
		cover.addIllustration(largeIllustration)
		const [first, second] = cover.illustrations

		cover.select(illustrationElementId(second?.key ?? -1))
		cover.deleteSelected()

		expect(cover.illustrations.map(({ key }) => key)).toEqual([first?.key])
		expect(cover.selected).toBeNull()

		cover.select(illustrationElementId(first?.key ?? -1))
		cover.deleteSelected()

		expect(cover.illustrations).toEqual([])
	})
})
