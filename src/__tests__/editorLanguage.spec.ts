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

describe('Language selector in the editor', () => {
	it('is there with and without Cover editing', async () => {
		await renderWorksheet()
		expect(screen.getByRole('combobox', { name: 'Idioma' })).toBeInTheDocument()

		await fireEvent.click(
			screen.getByRole('button', { name: 'Editar portada' }),
		)

		expect(screen.getByRole('combobox', { name: 'Idioma' })).toBeInTheDocument()
	})

	it('translates the Cover texts the user has not edited', async () => {
		await renderWorksheet()
		await fireEvent.click(
			screen.getByRole('button', { name: 'Editar portada' }),
		)

		await fireEvent.update(
			screen.getByRole('combobox', { name: 'Idioma' }),
			'en',
		)

		const preview = within(screen.getByRole('group', { name: 'Cover preview' }))
		expect(preview.getByText('My favorite destination')).toBeInTheDocument()
		expect(preview.getByText(dateLine(new Date(), 'en'))).toBeInTheDocument()
	})
})
