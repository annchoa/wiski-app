import { fireEvent, render, screen, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import { createWikiI18n } from '../i18n'
import { dateLine } from '../lib/dateLine'
import { createWikiRouter } from '../router'

async function renderWorksheet() {
	const router = createWikiRouter(createMemoryHistory())
	await router.push('/worksheet/wiski-route')
	render(App, { global: { plugins: [createWikiI18n(), router] } })
}

// The Typeface tiles repeat the words of the selected text.
function inPreview() {
	return within(
		screen.getByRole('group', { name: 'Vista previa de la portada' }),
	)
}

async function startCoverEditing() {
	await fireEvent.click(screen.getByRole('button', { name: 'Editar portada' }))
}

describe('Cover editing', () => {
	it('swaps the editor for the Tool panel and the Cover preview, and back with Done', async () => {
		await renderWorksheet()
		expect(screen.getByRole('group', { name: 'Páginas' })).toBeInTheDocument()

		await startCoverEditing()

		expect(
			screen.getByRole('button', { name: 'Editar portada' }),
		).toHaveAttribute('aria-pressed', 'true')
		expect(
			screen.getByRole('group', { name: 'Vista previa de la portada' }),
		).toBeInTheDocument()
		expect(screen.getByRole('tab', { name: 'Colores' })).toHaveAttribute(
			'aria-selected',
			'true',
		)
		expect(screen.queryByRole('group', { name: 'Páginas' })).toBeNull()

		await fireEvent.click(screen.getByRole('button', { name: 'Listo' }))

		expect(screen.getByRole('group', { name: 'Páginas' })).toBeInTheDocument()
		expect(
			screen.queryByRole('group', { name: 'Vista previa de la portada' }),
		).toBeNull()
	})

	it('also leaves with the book button', async () => {
		await renderWorksheet()

		await startCoverEditing()
		await startCoverEditing()

		expect(screen.getByRole('group', { name: 'Páginas' })).toBeInTheDocument()
	})

	it('starts with the default Title and the current month and year', async () => {
		await renderWorksheet()

		await startCoverEditing()

		expect(screen.getByText('Mi destino favorito')).toBeInTheDocument()
		expect(screen.getByText(dateLine(new Date(), 'es'))).toBeInTheDocument()
	})

	it('keeps the chosen Color scheme when Cover editing starts again', async () => {
		await renderWorksheet()
		await startCoverEditing()

		await fireEvent.click(screen.getByRole('button', { name: 'Color 3' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Listo' }))
		await startCoverEditing()

		expect(screen.getByRole('button', { name: 'Color 3' })).toHaveAttribute(
			'aria-pressed',
			'true',
		)
	})

	it('follows the selection with the Tool menu, and the user can go back to the Colors', async () => {
		await renderWorksheet()
		await startCoverEditing()
		const selectedItem = () =>
			screen
				.getAllByRole('tab')
				.find((item) => item.getAttribute('aria-selected') === 'true')
				?.textContent?.trim()

		await fireEvent.click(screen.getByText('Mi destino favorito'))
		expect(selectedItem()).toBe('Tipografías')

		await fireEvent.click(
			screen.getByRole('img', { name: 'Ilustración de la portada' }),
		)
		expect(selectedItem()).toBe('Ilustraciones')

		await fireEvent.click(screen.getByRole('tab', { name: 'Colores' }))
		expect(selectedItem()).toBe('Colores')
		expect(screen.queryByRole('button', { name: 'Cambiar color' })).toBeNull()
	})

	it('shows the words of the selected text in each Typeface', async () => {
		await renderWorksheet()
		await startCoverEditing()

		await fireEvent.click(screen.getByText(dateLine(new Date(), 'es')))

		expect(screen.getByRole('button', { name: 'Chicle' })).toHaveTextContent(
			dateLine(new Date(), 'es'),
		)
	})

	it('adds an Illustration to the Cover from the Illustration list', async () => {
		await renderWorksheet()
		await startCoverEditing()
		const picture = { name: 'Ilustración de la portada' }
		expect(screen.getAllByRole('img', picture)).toHaveLength(1)

		await fireEvent.click(screen.getByRole('img', picture))
		await fireEvent.click(screen.getByRole('button', { name: 'Ilustración 2' }))

		expect(screen.getAllByRole('img', picture)).toHaveLength(2)
	})

	it('formats the selected text from the toolbar, and the other text stays as it was', async () => {
		await renderWorksheet()
		await startCoverEditing()
		const title = () => inPreview().getByText('Mi destino favorito')
		await fireEvent.click(title())

		await fireEvent.click(
			screen.getByRole('button', { name: 'Aumentar tamaño de letra' }),
		)
		await fireEvent.click(screen.getByRole('button', { name: 'Subrayado' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Tachado' }))
		await fireEvent.click(
			screen.getByRole('button', { name: 'Alineación centrada' }),
		)

		expect(
			screen.getByRole('textbox', { name: 'Tamaño de letra' }),
		).toHaveValue('47')
		expect(title()).toHaveStyle({
			textDecoration: 'underline line-through',
			textAlign: 'right',
		})
		expect(inPreview().getByText(dateLine(new Date(), 'es'))).toHaveStyle({
			textDecoration: 'none',
			textAlign: 'center',
		})
	})

	it('spaces the lines and the letters of the selected text from the Spacing popover', async () => {
		await renderWorksheet()
		await startCoverEditing()
		const title = () => inPreview().getByText('Mi destino favorito')
		expect(title().style.lineHeight).toBe('1.2')
		await fireEvent.click(title())

		await fireEvent.click(screen.getByRole('button', { name: 'Espaciado' }))
		await fireEvent.click(
			screen.getByRole('button', { name: 'Aumentar interlineado' }),
		)
		await fireEvent.click(
			screen.getByRole('button', { name: 'Aumentar espaciado entre letras' }),
		)

		expect(title().style.lineHeight).toBe('1.3')
		expect(title().style.letterSpacing).toBe('0.01em')
	})
})
