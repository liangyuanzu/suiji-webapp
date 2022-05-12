<template>
  <main class="mt-48px mx-auto max-w-400px min-w-300px text-center text-black text-opacity-85">
    <div class="mb-36px">
      <img class="mx-auto w-64px h-64px" src="@/assets/svg/logo.svg">
    </div>
    <a-card :body-style="{padding: '40px 50px 32px'}">
      <router-view />
    </a-card>
  </main>
</template>
