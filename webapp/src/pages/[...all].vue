<script setup lang="ts">
import { useI18n } from '@suiji/locale'

const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('common.not_found') }}
  </div>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
