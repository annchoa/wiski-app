<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>

<template>
  <div class="relative h-8 w-[62px]">
    <select
      v-model="locale"
      :aria-label="$t('language.label')"
      class="h-full w-full appearance-none rounded-lg border border-neutral-200 bg-secondary pr-8 pl-2.5 text-sm font-semibold text-primary hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_5%)] active:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_10%)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
    <PhCaretDown aria-hidden="true" class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-secondary-foreground" />
  </div>
</template>
