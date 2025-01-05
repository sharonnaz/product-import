<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";

const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});

// Clear errors when the component is mounted
onMounted(() => {
  errors.value = {};
});
</script>

<template>
  <main>
    <h1 class="title">Login to your account</h1>

    <form
      @submit.prevent="authenticate('login', formData)"
      class="w-1/2 mx-auto space-y-6"
    >
      <div>
        <input 
          type="text" 
          placeholder="Email" 
          v-model="formData.email" 
          class="input"
        />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          v-model="formData.password"
          class="input"
        />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>

      <!-- Display general error message if exists -->
      <div v-if="Object.keys(errors).length > 0 && !errors.email && !errors.password" class="error">
        {{ errors.message || "Please fix the errors above." }}
      </div>

      <button type="submit" class="primary-btn">Login</button>
    </form>
  </main>
</template>

<style scoped>
.title {
  font-size: 2rem;
  text-align: center;
}

.input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 0.875rem;
}

.primary-btn {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary-btn:hover {
  background-color: #0056b3;
}
</style>
