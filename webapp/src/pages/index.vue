<script setup lang="ts">
// import { useI18n } from '@suiji/locale'
// import { testApi } from '@suiji/apis/test/test'
// import { onMounted } from 'vue'
// import { useUserStore } from '@/stores/user'

// const user = useUserStore()
// const name = ref(user.savedName)

// const router = useRouter()
// const go = () => {
//   if (name.value)
//     router.push(`/hi/${encodeURIComponent(name.value)}`)
// }

// const { t } = useI18n()

// onMounted(async() => {
//   await testApi()
// })

// const selectedKeys = ref<string[]>(['4'])
</script>

<template>
  <!-- <a-layout>
    <a-layout-sider
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
    >
      <div class="logo" />

      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <user-outlined />
          <span class="nav-text">nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span class="nav-text">nav 2</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </a-layout> -->
  <!-- <a-layout>
    <a-layout-header>Header</a-layout-header>
    <a-layout>
      <a-layout-sider>Sider</a-layout-sider>
      <a-layout-content>Content</a-layout-content>
    </a-layout>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout> -->
  差的地方大幅度
</template>

<style lang="less" scoped>
:deep(#components-layout-demo-fixed-sider) .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
