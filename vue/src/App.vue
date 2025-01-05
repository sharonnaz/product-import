<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <header>
    <nav>
      <RouterLink :to="{ name: 'products' }" class="nav-link">Products</RouterLink>

      <div v-if="authStore.user" class="flex items-center space-x-6">
        
        <form @submit.prevent="authStore.logout">
          <button class="nav-link">Logout</button>
        </form>
      </div>

      <div v-else class="space-x-6">
        <RouterLink :to="{ name: 'register' }" class="nav-link">
          Register
        </RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-link">
          Login
        </RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>
