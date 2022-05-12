<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue'

const selectedKeys = ref<string[]>(['tasks'])

const router = useRouter()

const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
  router.push(`/${key}`)
}

const signout = () => {
  localStorage.clear()
  router.push('/signin')
}
</script>

<template>
  <a-layout>
    <a-layout-sider
      :style="{ background: 'rgba(71,114,250,0.08)' }"
      theme="light"
      :width="49"
    >
      <a-popover placement="bottomLeft" trigger="click" overlay-class-name="avatar-popover" class="cursor-pointer">
        <template #content>
          <div class="cursor-pointer flex items-center" @click="signout">
            <logout-outlined class="mr-6px" :style="{ fontSize: '16px', color: '#ccc' }" />
            <span :style="{ color: '#666' }">退出登录</span>
          </div>
        </template>
        <div class="flex justify-center mt-16px mb-10px">
          <img src="@/assets/images/avatar.png" class="inline-block w-32px h-32px">
        </div>
      </a-popover>

      <div class="sider-menu">
        <a-menu v-model:selectedKeys="selectedKeys" :style="{ background: 'unset' }" @click="handleMenuItemClick">
          <a-menu-item key="tasks">
            <check-square-filled :style="{ fontSize: '20px' }" />
          </a-menu-item>
          <a-menu-item key="calendar">
            <calendar-filled :style="{ fontSize: '20px' }" />
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
:deep(.ant-layout-sider) {
  border-right: 1px solid rgba(25,25,25,0.05);
}

.sider-menu {
  :deep(.ant-menu-item-selected) {
    background-color: unset !important;
    color: #1890ff;
  }

  :deep(.ant-menu-item) {
    text-overflow: unset;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: unset;
    height: auto;
    margin-top: 20px;

    &:not(.ant-menu-item-selected) {
      color: rgba(25,25,25,0.4);
    }
  }
}

</style>

<style lang="less">
.avatar-popover {
  left: 10px !important;
  top: 45px !important;

  .ant-popover-arrow {
    display: none !important;
  }
}
</style>
