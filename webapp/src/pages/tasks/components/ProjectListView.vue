<script setup lang="ts">
import {
  CalendarFilled,
  ContainerFilled,
  EllipsisOutlined,
  MenuOutlined,
} from '@ant-design/icons-vue'

import { storeToRefs } from 'pinia'
import { ModalType, ProjectType } from '@/types/project'
import { useProjectStore, useProjectStoreWithOut } from '@/store/project'
import { useTaskStore } from '@/store/task'
import { useMessage } from '@/hooks/web/useMessage'

const { getProjects } = useProjectStoreWithOut()
getProjects()

const { inboxProject, normalProjects, currentProject } = storeToRefs(useProjectStore())
const { todayTaskCount, sevenDaysTaskCount } = storeToRefs(useTaskStore())

const { setCurrent } = useProjectStoreWithOut()
setTimeout(() => {
  setCurrent({
    id: inboxProject?.value?.id ?? '',
    name: '收集箱',
    type: ProjectType.INBOX,
  })
}, 500)

const selectedKeys = ref<string[]>([])
const projectModalType = ref<string>(ModalType.Create)
const projectName = ref<string>('')
const projectModalVisible = ref<boolean>(false)
const deleteProjectModalVisible = ref<boolean>(false)
const editProjectId = ref<string>('')

const smartProjects = computed(() => [{
  id: 'smart-project-today',
  icon: CalendarFilled,
  name: '今天',
  taskCount: todayTaskCount,
},
{
  id: 'smart-project-last-seven-days',
  icon: CalendarFilled,
  name: '最近7天',
  taskCount: sevenDaysTaskCount,
},
{
  id: inboxProject?.value?.id ?? '',
  icon: ContainerFilled,
  name: '收集箱',
  taskCount: inboxProject?.value?.taskCount ?? 0,
}])

const projectList = reactive({
  smart: smartProjects,
  normal: normalProjects,
})

const modalTitle = computed(() => projectModalType.value === ModalType.Create ? '添加清单' : '编辑清单')

watchEffect(() => {
  selectedKeys.value = [inboxProject?.value?.id ?? '']
})

const handleProjectClick = ({ key }) => {
  const { setCurrent } = useProjectStoreWithOut()

  const smart = smartProjects.value.find(item => item.id === key)
  if (smart) {
    setCurrent({
      id: smart.id,
      name: smart.name,
      type: ProjectType.INBOX,
    })
  }
  else {
    const normal = normalProjects.value.find(item => item.id === key)
    if (normal) {
      setCurrent({
        id: normal.id,
        name: normal.name,
        type: ProjectType.NORMAL,
      })
    }
  }
}

const showProjectModal = () => {
  projectModalVisible.value = true
}

const closeProjectModal = () => {
  projectModalVisible.value = false
}

const handleAddProject = () => {
  projectModalType.value = ModalType.Create
  showProjectModal()
}

const operations = [
  {
    name: '编辑',
    handle: (id: string) => {
      projectModalType.value = ModalType.Edit
      editProjectId.value = id
      showProjectModal()
    },
  },
  {
    name: '删除',
    handle: () => {
      deleteProjectModalVisible.value = true
    },
  },
]

const projectModalConfirm = () => {
  const { addProject, editProject } = useProjectStoreWithOut()

  if (projectModalType.value === ModalType.Create) {
    addProject({
      name: projectName.value,
      type: ProjectType.NORMAL,
    })
  }
  else {
    editProject({
      id: editProjectId.value,
      name: projectName.value,
    })
  }

  const { createMessage } = useMessage()
  createMessage.success(projectModalType.value === ModalType.Create ? '添加清单成功' : '编辑清单成功')

  closeProjectModal()
  projectName.value = ''
  editProjectId.value = ''
}

const handleDeleteProjectModalConfirm = () => {
  const { removeProject } = useProjectStoreWithOut()
  removeProject({ id: currentProject.value?.id ?? '' })

  const { createMessage } = useMessage()
  createMessage.success('删除清单成功')

  deleteProjectModalVisible.value = false
}
</script>

<template>
  <div class="p-x-8px" :style="{height: '100vh'}">
    <div class="project-view mt-14px">
      <a-menu v-model:selectedKeys="selectedKeys" @click="handleProjectClick">
        <a-menu-item v-for="project in projectList.smart" :key="project.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <component :is="project.icon" :style="{ fontSize: '16px' }" class="mr-8px icon" />
              {{ project.name }}
            </div>
            <span>{{ project.taskCount }}</span>
          </div>
        </a-menu-item>

        <a-divider />

        <div class="project-title flex items-center justify-between cursor-pointer">
          <span class="text-gray-500">清单</span>
          <span class="plus-icon w-24px h-24px flex items-center justify-center rounded-2px invisible hover:(bg-gray-900 bg-opacity-5)" @click="handleAddProject">
            <plus-outlined :style="{ fontSize: '16px', color: 'rgba(25, 25, 25, 0.6)' }" />
          </span>
        </div>

        <div v-if="projectList.normal.length === 0" class="ml-14px mr-8px rounded-4px px-8px py-6px text-12px leading-18px" :style="{ backgroundColor: '#19191908', color: '#19191966' }">
          用清单来分类收集、组织和管理你的任务和笔记
        </div>

        <a-menu-item v-for="project in projectList.normal" :key="project.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <menu-outlined :style="{ fontSize: '16px' }" class="mr-8px icon" />
              {{ project.name }}
            </div>
            <span v-if="project.taskCount" class="count">{{ project.taskCount }}</span>

            <a-popover placement="bottomLeft" trigger="click" overlay-class-name="project-operate-popover" class="cursor-pointer">
              <template #content>
                <div class="w-150px" :style="{ color: '#666' }">
                  <div v-for="item in operations" :key="item.name" class="cursor-pointer mb-4px px-16px leading-35px operational-item" @click="item.handle(project.id)">
                    {{ item.name }}
                  </div>
                </div>
              </template>
              <ellipsis-outlined :style="{ fontSize: '20px' }" class="ellipsis-icon !text-gray-400 hover:(!text-dark-400)" />
            </a-popover>
          </div>
        </a-menu-item>

        <a-divider />
      </a-menu>
    </div>
  </div>

  <a-modal
    v-model:visible="projectModalVisible"
    :title="modalTitle"
    cancel-text="关闭"
    ok-text="保存"
    wrap-class-name="project-modal"
    :mask="false"
    :mask-closable="false"
    :width="440"
    @ok="projectModalConfirm"
  >
    <a-input
      v-model:value="projectName"
      placeholder="名称" size="large"
      :style="{ backgroundColor: 'rgba(25, 25, 25, 0.05)'}"
      :maxlength="20"
    >
      <template #prefix>
        <menu-outlined :style="{ color: 'rgba(25, 25, 25, 0.4)' }" />
      </template>
    </a-input>
  </a-modal>

  <a-modal v-model:visible="deleteProjectModalVisible" :mask="false" title="删除清单" @ok="handleDeleteProjectModalConfirm">
    <div>
      删除订单会删除其下所有的任务。确认删除清单（{{ currentProject?.name ?? '' }}）？
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.project-view {
  :deep(.ant-menu) {
    border: unset;

    .ant-menu-item {
      border-radius: 6px;
      color: #666;

      .icon {
        color: rgba(25, 25, 25, 0.4);
      }
    }

    .ant-menu-item-selected {
      background-color: rgba(71,114,250,0.1);
    }

    .ant-menu-item-active {
      .count {
        display: none !important;
      }

      .ellipsis-icon {
        display: inline-block !important;
      }

      &:not(.ant-menu-item-selected){
        background-color: rgba(71,114,250,0.05);
      }
    }

    &:not(.ant-menu-item-active) {
      .count {
        display: inline;
      }

      .ellipsis-icon {
        display: none;
      }
    }
  }

  .project-title {
    line-height: 30px;
    font-size: 12px;
    padding-left: 14px;
    padding-right: 12px;

    &:hover {
      border-radius: 6px;
      background-color: rgba(71,114,250,0.05);

      .plus-icon {
        visibility: visible;
      }
    }
  }
}
</style>

<style lang="less">
.project-operate-popover {
  .ant-popover-arrow {
    display: none !important;
  }

  .ant-popover-inner {
    border-radius: 4px !important;

    .ant-popover-inner-content {
      padding-left: 0;
      padding-right: 0;

      .operational-item {
        &:hover {
          background-color: rgba(71,114,250,0.05);
        }
      }
    }
  }
}

.project-modal {
  .ant-input-affix-wrapper {
    &:not(.ant-input-affix-wrapper-focused) {
      border-color: transparent;
    }

    input {
      background-color: transparent;
    }
  }
}
</style>
