<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

const { locale } = useI18n()
</script>

<template>
  <NativeSelect v-model="locale" :aria-label="$t('language.label')">
    <NativeSelectOption value="es">ES</NativeSelectOption>
    <NativeSelectOption value="en">EN</NativeSelectOption>
  </NativeSelect>
</template>
