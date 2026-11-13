<script setup lang="ts">
import {
	PhArrowsHorizontal,
	PhArrowsVertical,
	PhMinus,
	PhPlus,
	PhTextAlignCenter,
	PhTextAlignLeft,
	PhTextAlignRight,
	PhTextStrikethrough,
	PhTextT,
	PhTextUnderline,
} from '@phosphor-icons/vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type ColorScheme, colorSchemes } from '@/lib/colorSchemes'
import {
	type CoverElementId,
	illustrationKeyOf,
	type TextStyle,
} from '@/lib/cover'
import {
	type Illustration,
	illustrations,
	illustrationUrl,
} from '@/lib/illustrations'
import { maxLetterSizePt, minLetterSizePt } from '@/lib/letterSize'
import { typefaces } from '@/lib/typefaces'

const props = defineProps<{
	selected: CoverElementId | null
	colorScheme: ColorScheme
	// The Typeface and the words of the selected text.
	typefaceName: string
	selectedText: string
	textStyle: TextStyle
}>()
const emit = defineEmits<{
	selectColorScheme: [colorScheme: ColorScheme]
	selectTypeface: [name: string]
	selectIllustration: [illustration: Illustration]
	setLetterSize: [pt: number]
	setLineSpacing: [multiple: number]
	setLetterSpacing: [thousandthsOfEm: number]
	toggleUnderline: []
	toggleStrikethrough: []
	cycleAlignment: []
	done: []
}>()

// The Tool menu items, in order. Each one shows one list.
const lists = ['colors', 'typefaces', 'illustrations'] as const
type List = (typeof lists)[number]

// Selecting an element opens the list that edits it. Clearing the selection
// keeps the list the user was on.
function listOfSelected(selected: CoverElementId | null): List | null {
	if (selected === null) return null
	return illustrationKeyOf(selected) !== null ? 'illustrations' : 'typefaces'
}

const isTextSelected = computed(
	() => listOfSelected(props.selected) === 'typefaces',
)

// The default Title, "Mi destino favorito", is 19 characters long: a longer
// sample would not fit in a row.
const longestSample = 19

const sample = computed(() => {
	const words = props.selectedText.trim()
	if (!isTextSelected.value || words === '') return null
	return words.length > longestSample
		? `${words.slice(0, longestSample)}…`
		: words
})

const list = ref<List>(listOfSelected(props.selected) ?? 'colors')
watch(
	() => props.selected,
	(selected) => {
		list.value = listOfSelected(selected) ?? list.value
	},
)

// The field keeps what the user types until Enter or blur.
const letterSizeDraft = ref(String(props.textStyle.letterSizePt))
watch(
	() => props.textStyle.letterSizePt,
	(pt) => {
		letterSizeDraft.value = String(pt)
	},
)

function changeLetterSize(pt: number) {
	const limited = Math.min(maxLetterSizePt, Math.max(minLetterSizePt, pt))
	letterSizeDraft.value = String(limited)
	if (limited !== props.textStyle.letterSizePt) emit('setLetterSize', limited)
}

function stepLetterSize(step: number) {
	changeLetterSize(props.textStyle.letterSizePt + step)
}

function commitLetterSize() {
	const typed = Number(letterSizeDraft.value)
	if (letterSizeDraft.value.trim() === '' || Number.isNaN(typed)) {
		letterSizeDraft.value = String(props.textStyle.letterSizePt)
		return
	}
	changeLetterSize(Math.round(typed))
}

const isSpacingOpen = ref(false)
const spacingMenu = ref<HTMLElement | null>(null)
onClickOutside(spacingMenu, () => {
	isSpacingOpen.value = false
})
useEventListener(document, 'keydown', (event) => {
	if (event.key === 'Escape') isSpacingOpen.value = false
})
watch([isTextSelected, list], () => {
	isSpacingOpen.value = false
})

const { locale } = useI18n()
const lineSpacingText = computed(() =>
	new Intl.NumberFormat(locale.value, { minimumFractionDigits: 1 }).format(
		props.textStyle.lineSpacing,
	),
)

function stepLineSpacing(step: number) {
	// Tenths: 1.2 + 0.1 would give 1.2999999999999998.
	const tenths = Math.round(props.textStyle.lineSpacing * 10) + step
	const limited = Math.min(20, Math.max(8, tenths))
	if (limited !== Math.round(props.textStyle.lineSpacing * 10)) {
		emit('setLineSpacing', limited / 10)
	}
}

function stepLetterSpacing(step: number) {
	const limited = Math.min(
		500,
		Math.max(-100, props.textStyle.letterSpacing + step),
	)
	if (limited !== props.textStyle.letterSpacing)
		emit('setLetterSpacing', limited)
}

function isCurrentColorScheme(candidate: ColorScheme) {
	return (
		candidate.background === props.colorScheme.background &&
		candidate.textColor === props.colorScheme.textColor
	)
}
</script>

<template>
  <div class="flex h-full w-[408px] shrink-0 flex-col bg-white">
    <div role="tablist" class="flex h-12 shrink-0 gap-2 border-b border-neutral-200 px-4">
      <button
        v-for="item in lists"
        :key="item"
        type="button"
        role="tab"
        :aria-selected="list === item"
        class="border-b-2 border-transparent px-3 text-sm text-neutral-500 aria-selected:border-neutral-950 aria-selected:font-semibold aria-selected:text-neutral-950"
        @click="list = item"
      >
        {{ $t(`editor.cover.${item}`) }}
      </button>
    </div>

    <div
      v-if="list === 'typefaces'"
      role="toolbar"
      :aria-label="$t('editor.cover.textFormat')"
      class="flex h-14 shrink-0 items-center gap-2 px-4"
    >
      <div class="flex h-10 w-32 items-center rounded-lg border border-neutral-200 p-1">
        <button type="button" :aria-label="$t('editor.cover.decreaseLetterSize')" :disabled="!isTextSelected" class="flex size-8 items-center justify-center rounded-md disabled:opacity-40" @click="stepLetterSize(-1)">
          <PhMinus />
        </button>
        <input
          v-model="letterSizeDraft"
          :aria-label="$t('editor.cover.letterSize')"
          :disabled="!isTextSelected"
          inputmode="numeric"
          class="min-w-0 flex-1 bg-transparent text-center text-sm disabled:opacity-40"
          @keydown.enter="commitLetterSize"
          @blur="commitLetterSize"
        />
        <button type="button" :aria-label="$t('editor.cover.increaseLetterSize')" :disabled="!isTextSelected" class="flex size-8 items-center justify-center rounded-md disabled:opacity-40" @click="stepLetterSize(1)">
          <PhPlus />
        </button>
      </div>
      <button type="button" :aria-label="$t('editor.cover.underline')" :aria-pressed="textStyle.underline" :disabled="!isTextSelected" class="flex size-10 items-center justify-center rounded-lg aria-pressed:bg-neutral-100 disabled:opacity-40" @click="$emit('toggleUnderline')">
        <PhTextUnderline :size="20" />
      </button>
      <button type="button" :aria-label="$t('editor.cover.strikethrough')" :aria-pressed="textStyle.strikethrough" :disabled="!isTextSelected" class="flex size-10 items-center justify-center rounded-lg aria-pressed:bg-neutral-100 disabled:opacity-40" @click="$emit('toggleStrikethrough')">
        <PhTextStrikethrough :size="20" />
      </button>
      <button type="button" :aria-label="$t(`editor.cover.alignment.${textStyle.alignment}`)" :disabled="!isTextSelected" class="flex size-10 items-center justify-center rounded-lg disabled:opacity-40" @click="$emit('cycleAlignment')">
        <PhTextAlignLeft v-if="textStyle.alignment === 'left'" :size="20" />
        <PhTextAlignCenter v-else-if="textStyle.alignment === 'center'" :size="20" />
        <PhTextAlignRight v-else :size="20" />
      </button>
      <div ref="spacingMenu" class="relative">
        <button
          type="button"
          :aria-label="$t('editor.cover.spacing')"
          :aria-expanded="isSpacingOpen"
          :disabled="!isTextSelected"
          class="flex size-10 flex-col items-center justify-center rounded-lg aria-expanded:bg-neutral-100 disabled:opacity-40"
          @click="isSpacingOpen = !isSpacingOpen"
        >
          <PhTextT :size="16" />
          <PhArrowsHorizontal :size="20" />
        </button>
        <div
          v-if="isSpacingOpen"
          role="dialog"
          :aria-label="$t('editor.cover.spacing')"
          class="absolute right-0 top-full z-10 mt-2 flex w-[196px] flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg"
        >
          <div class="flex items-center gap-2">
            <PhArrowsVertical :size="20" aria-hidden="true" />
            <div role="group" :aria-label="$t('editor.cover.lineSpacing')" class="flex h-10 w-32 items-center rounded-lg border border-neutral-200 p-1">
              <button type="button" :aria-label="$t('editor.cover.decreaseLineSpacing')" class="flex size-8 items-center justify-center rounded-md" @click="stepLineSpacing(-1)">
                <PhMinus />
              </button>
              <span class="flex-1 text-center text-sm">{{ lineSpacingText }}</span>
              <button type="button" :aria-label="$t('editor.cover.increaseLineSpacing')" class="flex size-8 items-center justify-center rounded-md" @click="stepLineSpacing(1)">
                <PhPlus />
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <PhArrowsHorizontal :size="20" aria-hidden="true" />
            <div role="group" :aria-label="$t('editor.cover.letterSpacing')" class="flex h-10 w-32 items-center rounded-lg border border-neutral-200 p-1">
              <button type="button" :aria-label="$t('editor.cover.decreaseLetterSpacing')" class="flex size-8 items-center justify-center rounded-md" @click="stepLetterSpacing(-10)">
                <PhMinus />
              </button>
              <span class="flex-1 text-center text-sm">{{ textStyle.letterSpacing }}</span>
              <button type="button" :aria-label="$t('editor.cover.increaseLetterSpacing')" class="flex size-8 items-center justify-center rounded-md" @click="stepLetterSpacing(10)">
                <PhPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ul
      class="min-h-0 flex-1 content-start gap-4 overflow-y-auto p-4"
      :class="list === 'typefaces' ? 'flex flex-col' : 'grid grid-cols-2'"
    >
      <template v-if="list === 'colors'">
        <li v-for="(candidate, index) in colorSchemes" :key="candidate.background + candidate.textColor">
          <button
            type="button"
            :aria-label="$t('editor.cover.colorScheme', { number: index + 1 })"
            :aria-pressed="isCurrentColorScheme(candidate)"
            :style="{ backgroundColor: candidate.background, color: candidate.textColor }"
            class="flex h-28 w-full items-center justify-center rounded-xl border border-neutral-200 text-[40px] font-semibold aria-pressed:border-2 aria-pressed:border-neutral-950"
            @click="$emit('selectColorScheme', candidate)"
          >
            Aa
          </button>
        </li>
      </template>

      <template v-else-if="list === 'typefaces'">
        <li v-for="typeface in typefaces" :key="typeface.name">
          <button
            type="button"
            :aria-label="typeface.name"
            :aria-pressed="typeface.name === typefaceName"
            :disabled="!isTextSelected"
            :style="{ fontFamily: `'${typeface.name}'` }"
            class="flex h-14 w-full items-center rounded-lg border border-neutral-200 bg-white px-4 text-[22px] aria-pressed:border-2 aria-pressed:border-neutral-950 disabled:opacity-40"
            @click="$emit('selectTypeface', typeface.name)"
          >
            {{ sample ?? $t('editor.cover.selectText') }}
          </button>
        </li>
      </template>

      <template v-else>
        <li v-for="(illustration, index) in illustrations" :key="illustration.id">
          <button
            type="button"
            :aria-label="$t('editor.cover.illustration', { number: index + 1 })"
            class="flex h-[140px] w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-400"
            @click="$emit('selectIllustration', illustration)"
          >
            <img :src="illustrationUrl(illustration.id)" alt="" class="size-full object-contain p-3" />
          </button>
        </li>
      </template>
    </ul>

    <div class="flex h-[72px] shrink-0 items-center px-4">
      <button
        type="button"
        class="h-10 w-full rounded-lg bg-neutral-950 text-sm font-semibold text-neutral-50"
        @click="$emit('done')"
      >
        {{ $t('editor.cover.done') }}
      </button>
    </div>
  </div>
</template>
