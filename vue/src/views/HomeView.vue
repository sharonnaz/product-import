<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";  // Import Vue Router

const router = useRouter();  

onMounted(() => {
  router.push({ name: 'login' });  
});
</script>

<template>
</template>
