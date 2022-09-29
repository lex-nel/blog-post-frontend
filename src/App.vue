<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { ref } from 'vue'

const items = ref<MenuItem[]>([
  { label: 'Users', to: { name: 'users' } },
  { label: 'Posts', to: { name: 'posts' } },
  { label: 'Comments', to: { name: 'comments' } },
])
</script>

<template>
  <header>
    <MegaMenu :model="items" />
  </header>
  <main class="main">
    <RouterView />
  </main>
</template>
