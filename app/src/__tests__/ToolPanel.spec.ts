import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ToolPanel from '../components/cover/ToolPanel.vue'
import { createWikiI18n } from '../i18n'
import { colorSchemes, defaultColorScheme } from '../lib/colorSchemes'
import type { CoverElementId, TextStyle } from '../lib/cover'
import { illustrations } from '../lib/illustrations'
import { defaultTypeface, typefaces } from '../lib/typefaces'

const defaultStyle: TextStyle = {
	letterSizePt: 46,
	lineSpacing: 1.2,
	letterSpacing: 0,
	underline: false,
	strikethrough: false,
	alignment: 'center',
}

function renderToolPanel(
	selected: CoverElementId | null,
	selectedText = 'Mi destino favorito',
	textStyle: Partial<TextStyle> = {},
) {
	return render(ToolPanel, {
		props: {
			selected,
			selectedText,
			colorScheme: defaultColorScheme,
			typefaceName: defaultTypeface.name,
			textStyle: { ...defaultStyle, ...textStyle },
		},
		global: { plugins: [createWikiI18n()] },
	})
}

describe('Tool panel', () => {
	it('opens on the Colors item of the Tool menu, with no heading above the list', () => {
		renderToolPanel(null)

		const items = screen.getAllByRole('tab')
		expect(items.map((item) => item.textContent?.trim())).toEqual([
			'Colores',
			'Tipografías',
			'Ilustraciones',
		])
		expect(screen.getByRole('tab', { name: 'Colores' })).toHaveAttribute(
			'aria-selected',
			'true',
		)
		expect(screen.queryByRole('heading')).toBeNull()
	})

	it('shows the list of the chosen Tool menu item', async () => {
		renderToolPanel(null)

		await fireEvent.click(screen.getByRole('tab', { name: 'Ilustraciones' }))
		expect(
			screen.getAllByRole('button', { name: /^Ilustración \d+$/ }),
		).toHaveLength(illustrations.length)
		expect(screen.queryByRole('button', { name: 'Color 1' })).toBeNull()

		await fireEvent.click(screen.getByRole('tab', { name: 'Colores' }))
		expect(screen.getAllByRole('button', { name: /^Color \d+$/ })).toHaveLength(
			colorSchemes.length,
		)
	})

	it('lists the Color schemes while nothing is selected and marks the current one', () => {
		renderToolPanel(null)

		const tiles = screen.getAllByRole('button', { name: /^Color \d+$/ })
		expect(tiles).toHaveLength(colorSchemes.length)
		expect(tiles[0]).toHaveAttribute('aria-pressed', 'true')
		expect(tiles[1]).toHaveAttribute('aria-pressed', 'false')
	})

	it('lists the Typefaces while a text is selected and marks the current one', () => {
		renderToolPanel('title')

		const rows = typefaces.map(({ name }) =>
			screen.getByRole('button', { name }),
		)
		expect(rows[0]).toHaveAttribute('aria-pressed', 'true')
		expect(rows[1]).toHaveAttribute('aria-pressed', 'false')
	})

	it('lists the Illustrations while an Illustration is selected', () => {
		renderToolPanel('illustration-0')

		const tiles = screen.getAllByRole('button', { name: /^Ilustración \d+$/ })
		expect(tiles).toHaveLength(illustrations.length)
	})

	it('shows the picture of each Illustration', () => {
		renderToolPanel('illustration-0')

		const tile = screen.getByRole('button', { name: 'Ilustración 1' })
		expect(tile.querySelector('img')).toHaveAttribute(
			'src',
			expect.stringContaining('illustrations/lemon-blue.png'),
		)
	})

	it('switches to the Typefaces or the Illustrations when the user selects that element, and keeps the item when the selection clears', async () => {
		const { rerender } = renderToolPanel(null)

		await rerender({ selected: 'title' })
		expect(screen.getByRole('tab', { name: 'Tipografías' })).toHaveAttribute(
			'aria-selected',
			'true',
		)

		await rerender({ selected: 'illustration-0' })
		expect(screen.getByRole('tab', { name: 'Ilustraciones' })).toHaveAttribute(
			'aria-selected',
			'true',
		)

		await rerender({ selected: null })
		expect(screen.getByRole('tab', { name: 'Ilustraciones' })).toHaveAttribute(
			'aria-selected',
			'true',
		)
	})

	it('shows the selected text in each Typeface', () => {
		renderToolPanel('dateLine', 'noviembre 2026')

		const row = screen.getByRole('button', { name: 'Chicle' })
		expect(row).toBeEnabled()
		expect(row).toHaveTextContent('noviembre 2026')
	})

	it('asks for a text when the selected text is empty, and keeps the Typefaces usable', () => {
		renderToolPanel('title', '  ')

		const row = screen.getByRole('button', { name: 'Chicle' })
		expect(row).toBeEnabled()
		expect(row).toHaveTextContent('Selecciona un texto')
	})

	it('cuts a long selected text after 19 characters, as long as "Mi destino favorito"', () => {
		renderToolPanel('title', 'Mi destino favorito y más')
		expect(screen.getByRole('button', { name: 'Chicle' })).toHaveTextContent(
			/^Mi destino favorito…$/,
		)
	})

	it('keeps a selected text of exactly 19 characters whole', () => {
		renderToolPanel('title', 'Mi destino favorito')
		expect(screen.getByRole('button', { name: 'Chicle' })).toHaveTextContent(
			/^Mi destino favorito$/,
		)
	})

	it('dims the Typefaces and asks for a text while no text is selected', async () => {
		const { emitted } = renderToolPanel(null)

		await fireEvent.click(screen.getByRole('tab', { name: 'Tipografías' }))

		const row = screen.getByRole('button', { name: 'Chicle' })
		expect(row).toBeDisabled()
		expect(row).toHaveTextContent('Selecciona un texto')
		await fireEvent.click(row)
		expect(emitted().selectTypeface).toBeUndefined()
	})

	describe('text toolbar', () => {
		const controls = [
			'Reducir tamaño de letra',
			'Aumentar tamaño de letra',
			'Subrayado',
			'Tachado',
			'Alineación centrada',
			'Espaciado',
		]

		it('shows only on the Typefaces item, above the list', async () => {
			renderToolPanel(null)
			expect(screen.queryByRole('toolbar')).toBeNull()

			await fireEvent.click(screen.getByRole('tab', { name: 'Tipografías' }))

			expect(
				screen.getByRole('toolbar', { name: 'Formato del texto' }),
			).toBeInTheDocument()
		})

		it('is disabled while no text is selected', async () => {
			renderToolPanel(null)
			await fireEvent.click(screen.getByRole('tab', { name: 'Tipografías' }))

			for (const name of controls) {
				expect(screen.getByRole('button', { name })).toBeDisabled()
			}
		})

		it('shows the Letter size in pt and steps it by 1 pt', async () => {
			const { emitted } = renderToolPanel('title')
			expect(
				screen.getByRole('textbox', { name: 'Tamaño de letra' }),
			).toHaveValue('46')

			await fireEvent.click(
				screen.getByRole('button', { name: 'Aumentar tamaño de letra' }),
			)
			await fireEvent.click(
				screen.getByRole('button', { name: 'Reducir tamaño de letra' }),
			)

			expect(emitted().setLetterSize).toEqual([[47], [45]])
		})

		it('stops the steps at 8 and 150 pt', async () => {
			const small = renderToolPanel('title', 'Título', { letterSizePt: 8 })
			await fireEvent.click(
				screen.getByRole('button', { name: 'Reducir tamaño de letra' }),
			)
			expect(small.emitted().setLetterSize).toBeUndefined()
			small.unmount()

			const large = renderToolPanel('title', 'Título', { letterSizePt: 150 })
			await fireEvent.click(
				screen.getByRole('button', { name: 'Aumentar tamaño de letra' }),
			)
			expect(large.emitted().setLetterSize).toBeUndefined()
		})

		it('applies a typed Letter size on Enter and on leaving the field', async () => {
			const { emitted } = renderToolPanel('title')
			const field = screen.getByRole('textbox', { name: 'Tamaño de letra' })

			await fireEvent.update(field, '60')
			await fireEvent.keyDown(field, { key: 'Enter' })
			await fireEvent.update(field, '70')
			await fireEvent.blur(field)

			expect(emitted().setLetterSize).toEqual([[60], [70]])
		})

		it('brings a typed Letter size out of range to the limit', async () => {
			const { emitted } = renderToolPanel('title')
			const field = screen.getByRole('textbox', { name: 'Tamaño de letra' })

			await fireEvent.update(field, '500')
			await fireEvent.keyDown(field, { key: 'Enter' })
			expect(field).toHaveValue('150')

			await fireEvent.update(field, '2')
			await fireEvent.blur(field)
			expect(field).toHaveValue('8')

			expect(emitted().setLetterSize).toEqual([[150], [8]])
		})

		it('goes back to the previous Letter size when the typed value is empty or not a number', async () => {
			const { emitted } = renderToolPanel('title')
			const field = screen.getByRole('textbox', { name: 'Tamaño de letra' })

			await fireEvent.update(field, '')
			await fireEvent.blur(field)
			expect(field).toHaveValue('46')

			await fireEvent.update(field, 'abc')
			await fireEvent.keyDown(field, { key: 'Enter' })
			expect(field).toHaveValue('46')

			expect(emitted().setLetterSize).toBeUndefined()
		})

		it('updates the field when the Letter size changes from outside', async () => {
			const { rerender } = renderToolPanel('title')

			await rerender({ textStyle: { ...defaultStyle, letterSizePt: 52 } })

			expect(
				screen.getByRole('textbox', { name: 'Tamaño de letra' }),
			).toHaveValue('52')
		})

		it('shows Underline and Strikethrough as pressed while the text has them, and toggles them', async () => {
			const off = renderToolPanel('title')
			expect(screen.getByRole('button', { name: 'Subrayado' })).toHaveAttribute(
				'aria-pressed',
				'false',
			)
			await fireEvent.click(screen.getByRole('button', { name: 'Subrayado' }))
			await fireEvent.click(screen.getByRole('button', { name: 'Tachado' }))
			expect(off.emitted().toggleUnderline).toHaveLength(1)
			expect(off.emitted().toggleStrikethrough).toHaveLength(1)
			off.unmount()

			renderToolPanel('title', 'Título', {
				underline: true,
				strikethrough: true,
			})
			expect(screen.getByRole('button', { name: 'Subrayado' })).toHaveAttribute(
				'aria-pressed',
				'true',
			)
			expect(screen.getByRole('button', { name: 'Tachado' })).toHaveAttribute(
				'aria-pressed',
				'true',
			)
		})

		it('names the Alignment button after the current Alignment and asks for the next one on click', async () => {
			const centered = renderToolPanel('title')
			await fireEvent.click(
				screen.getByRole('button', { name: 'Alineación centrada' }),
			)
			expect(centered.emitted().cycleAlignment).toHaveLength(1)
			centered.unmount()

			const left = renderToolPanel('title', 'Título', { alignment: 'left' })
			expect(
				screen.getByRole('button', { name: 'Alineación a la izquierda' }),
			).toBeInTheDocument()
			left.unmount()

			renderToolPanel('title', 'Título', { alignment: 'right' })
			expect(
				screen.getByRole('button', { name: 'Alineación a la derecha' }),
			).toBeInTheDocument()
		})

		describe('Spacing popover', () => {
			async function openSpacing(textStyle: Partial<TextStyle> = {}) {
				const rendered = renderToolPanel('title', 'Título', textStyle)
				await fireEvent.click(screen.getByRole('button', { name: 'Espaciado' }))
				return rendered
			}

			it('opens under the Spacing button, which looks active while it is open', async () => {
				renderToolPanel('title')
				const button = screen.getByRole('button', { name: 'Espaciado' })
				expect(screen.queryByRole('dialog')).toBeNull()
				expect(button).toHaveAttribute('aria-expanded', 'false')

				await fireEvent.click(button)

				expect(
					screen.getByRole('dialog', { name: 'Espaciado' }),
				).toBeInTheDocument()
				expect(button).toHaveAttribute('aria-expanded', 'true')
			})

			it('shows the Line spacing with a comma and the Letter spacing', async () => {
				await openSpacing({ lineSpacing: 1.2, letterSpacing: 40 })

				expect(screen.getByLabelText('Interlineado')).toHaveTextContent('1,2')
				expect(
					screen.getByLabelText('Espaciado entre letras'),
				).toHaveTextContent('40')
			})

			it('steps the Line spacing by 0.1 and the Letter spacing by 10', async () => {
				const { emitted } = await openSpacing()

				await fireEvent.click(
					screen.getByRole('button', { name: 'Aumentar interlineado' }),
				)
				await fireEvent.click(
					screen.getByRole('button', { name: 'Reducir interlineado' }),
				)
				await fireEvent.click(
					screen.getByRole('button', {
						name: 'Aumentar espaciado entre letras',
					}),
				)
				await fireEvent.click(
					screen.getByRole('button', {
						name: 'Reducir espaciado entre letras',
					}),
				)

				expect(emitted().setLineSpacing).toEqual([[1.3], [1.1]])
				expect(emitted().setLetterSpacing).toEqual([[10], [-10]])
			})

			it('stops the steps at the limits', async () => {
				const low = await openSpacing({ lineSpacing: 0.8, letterSpacing: -100 })
				await fireEvent.click(
					screen.getByRole('button', { name: 'Reducir interlineado' }),
				)
				await fireEvent.click(
					screen.getByRole('button', {
						name: 'Reducir espaciado entre letras',
					}),
				)
				expect(low.emitted().setLineSpacing).toBeUndefined()
				expect(low.emitted().setLetterSpacing).toBeUndefined()
				low.unmount()

				const high = await openSpacing({ lineSpacing: 2, letterSpacing: 500 })
				await fireEvent.click(
					screen.getByRole('button', { name: 'Aumentar interlineado' }),
				)
				await fireEvent.click(
					screen.getByRole('button', {
						name: 'Aumentar espaciado entre letras',
					}),
				)
				expect(high.emitted().setLineSpacing).toBeUndefined()
				expect(high.emitted().setLetterSpacing).toBeUndefined()
			})

			it('closes on Escape', async () => {
				await openSpacing()

				await fireEvent.keyDown(document.activeElement ?? document.body, {
					key: 'Escape',
				})

				expect(screen.queryByRole('dialog')).toBeNull()
			})

			it('closes on a click outside, and stays open on a click inside', async () => {
				await openSpacing()
				await new Promise((resolve) => setTimeout(resolve))

				await fireEvent.pointerDown(
					screen.getByRole('button', { name: 'Aumentar interlineado' }),
				)
				await fireEvent.click(
					screen.getByRole('button', { name: 'Aumentar interlineado' }),
				)
				expect(screen.getByRole('dialog')).toBeInTheDocument()

				await fireEvent.pointerDown(
					screen.getByRole('tab', { name: 'Colores' }),
				)
				await fireEvent.click(screen.getByRole('tab', { name: 'Colores' }))
				expect(screen.queryByRole('dialog')).toBeNull()
			})

			it('closes when the selection leaves the text', async () => {
				const { rerender } = await openSpacing()

				await rerender({ selected: 'illustration-0' })

				expect(screen.queryByRole('dialog')).toBeNull()
			})
		})

		it('is enabled while a text is selected', () => {
			renderToolPanel('title')

			for (const name of controls) {
				expect(screen.getByRole('button', { name })).toBeEnabled()
			}
		})
	})

	it('asks for the picked Color scheme, Typeface and Illustration', async () => {
		const colors = renderToolPanel(null)
		await fireEvent.click(screen.getByRole('button', { name: 'Color 3' }))
		expect(colors.emitted().selectColorScheme).toEqual([[colorSchemes[2]]])
		colors.unmount()

		const letters = renderToolPanel('dateLine')
		await fireEvent.click(screen.getByRole('button', { name: 'Chicle' }))
		expect(letters.emitted().selectTypeface).toEqual([['Chicle']])
		letters.unmount()

		const pictures = renderToolPanel('illustration-0')
		await fireEvent.click(screen.getByRole('button', { name: 'Ilustración 2' }))
		expect(pictures.emitted().selectIllustration).toEqual([[illustrations[1]]])
	})

	it('asks to finish Cover editing', async () => {
		const { emitted } = renderToolPanel(null)

		await fireEvent.click(screen.getByRole('button', { name: 'Listo' }))

		expect(emitted().done).toHaveLength(1)
	})
})
