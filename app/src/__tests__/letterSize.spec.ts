import { describe, expect, it } from 'vitest'
import { letterSizeFromPt, letterSizeInPt } from '../lib/letterSize'

// The Title of the design: 44 px on a 540 px sheet that is 20 cm wide.
const titleFraction = 44 / 540
const sheetWidthCm = 20

describe('Letter size', () => {
	it('shows the fraction of the sheet width as whole pt', () => {
		expect(letterSizeInPt(titleFraction, sheetWidthCm)).toBe(46)
	})

	it('turns pt into a fraction of the sheet width', () => {
		// 1 pt is 1/72 inch, and an inch is 2.54 cm.
		expect(letterSizeFromPt(72, 2.54)).toBe(1)
		expect(letterSizeFromPt(46, sheetWidthCm)).toBeCloseTo(titleFraction, 3)
	})
})
