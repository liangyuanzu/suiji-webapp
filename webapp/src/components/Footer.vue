<script setup lang="ts">
import { useI18n, useLocale } from '@suiji/locale'
import { isDark, toggleDark } from '@/composables'

const { changeLocale } = useLocale()

const toggleLocales = async() => {
  // change to some real logic

  await changeLocale('en')
  // const locales = availableLocales
  // locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const { t } = useI18n()
</script>

<template>
  <nav class="text-xl mt-6">
    <router-link class="icon-btn mx-2" to="/" :title="t('common.button.home')">
      <carbon-campsite />
    </router-link>

    <button class="icon-btn mx-2 !outline-none" :title="t('common.button.toggle_dark')" @click="toggleDark()">
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </button>

    <a class="icon-btn mx-2" :title="t('common.button.toggle_langs')" @click="toggleLocales">
      <carbon-language />
    </a>

    <router-link class="icon-btn mx-2" to="/about" :title="t('common.button.about')">
      <carbon-dicom-overlay />
    </router-link>

    <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank" title="GitHub">
      <carbon-logo-github />
    </a>
  </nav>
</template>
