import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import LanguageSelector from '../components/LanguageSelector.vue'
import { createWikiI18n } from '../i18n'

function renderSelector() {
	return render(LanguageSelector, { global: { plugins: [createWikiI18n()] } })
}

describe('Language selector', () => {
	it('shows the code of the current language', () => {
		renderSelector()
		expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveDisplayValue(
			'ES',
		)
	})

	it('switches the language and remembers it', async () => {
		renderSelector()
		await fireEvent.update(
			screen.getByRole('combobox', { name: 'Idioma' }),
			'en',
		)
		expect(
			screen.getByRole('combobox', { name: 'Language' }),
		).toHaveDisplayValue('EN')
		expect(localStorage.getItem('locale')).toBe('en')
	})
})
