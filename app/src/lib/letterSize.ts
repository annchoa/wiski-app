import { cmPerInch } from './resolution'

const ptPerInch = 72

export const minLetterSizePt = 8
export const maxLetterSizePt = 150

// The model keeps the Letter size as a fraction of the sheet width. The user
// sees it in pt, from the physical width of the Product.
export function letterSizeInPt(fraction: number, sheetWidthCm: number) {
	return Math.round((fraction * sheetWidthCm * ptPerInch) / cmPerInch)
}

export function letterSizeFromPt(pt: number, sheetWidthCm: number) {
	return (pt * cmPerInch) / (sheetWidthCm * ptPerInch)
}
