<script setup lang="ts">
import ProjectListView from './components/ProjectListView.vue'
import TaskListView from './components/TaskListView.vue'
import TaskDetailView from './components/TaskDetailView.vue'
</script>

<template>
  <div class="flex bg-light-50">
    <div class="w-239px border-r">
      <ProjectListView />
    </div>
    <div class="min-w-400px flex-auto border-r">
      <TaskListView />
    </div>
    <div class="w-647px">
      <TaskDetailView />
    </div>
  </div>
</template>

<style lang="less" scoped>
</style>

<route lang="yaml">
meta:
  layout: home
</route>
