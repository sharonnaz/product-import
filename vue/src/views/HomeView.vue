<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const { getAllPosts } = usePostsStore();
const posts = ref([]);

onMounted(async () => (posts.value = await getAllPosts()));
</script>

<template>

</template>
