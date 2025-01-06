<template>
  <main class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Products</h1>
      <label class="btn btn-primary">
        Import CSV
        <input 
        type="file" 
        id="file" 
        accept=".csv"
        class="hidden" 
        @change="handleFileImport" 
        :disabled="isLoading"
        />
      </label>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center py-4">
      <div class="loader"></div>
    </div>
    
    <div v-if="uploadMessage" class="p-4 mb-4 bg-green-50 text-green-700 rounded-md">
      {{ uploadMessage }}
    </div>
    <div v-if="uploadErrors.length" class="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
      <ul class="list-disc pl-4">
        <li v-for="(error, index) in uploadErrors" :key="index">{{ error }}</li>
      </ul>
    </div>
    
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Serial No.</th>
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Price</th>
          <th class="border border-gray-300 px-4 py-2">SKU</th>
          <th class="border border-gray-300 px-4 py-2">Description</th>
          <th class="border border-gray-300 px-4 py-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ product.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ product.price }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ product.sku }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ product.description }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ product.created_at }}</td>
        </tr>
        <tr v-if="!isLoading && products.length === 0">
          <td colspan="6" class="text-center py-4">No products available.</td>
        </tr>
      </tbody>
    </table>
    
    <div class="flex justify-between items-center mt-4">
      <button
      class="btn btn-secondary"
      :disabled="currentPage === 1 || isLoading"
      @click="changePage(currentPage - 1)"
      >
      Previous
    </button>
    
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    
    <button
    class="btn btn-secondary"
    :disabled="currentPage === totalPages || isLoading"
    @click="changePage(currentPage + 1)"
    >
    Next
  </button>
</div>

<div v-if="errors" class="mt-4 text-red-500">
  <p>{{ errors.message }}</p>
</div>
</main>
</template>

<script setup>
import { useProductsStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

const { fetchProducts } = useProductsStore();
const { products, errors } = storeToRefs(useProductsStore());

const currentPage = ref(1);
const totalPages = ref(0);
const perPage = ref(10);
const uploadMessage = ref('');
const uploadErrors = ref([]);
const isLoading = ref(false);

const loadProducts = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await fetchProducts(page);
    
    if (response && response.data && response.data.data) {
      products.value = response.data.data;
      totalPages.value = response.data.last_page || 1;
      perPage.value = response.data.per_page || 10;
    } else {
      products.value = [];
      errors.value = { message: 'No products found.' };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products.value = [];
    errors.value = { message: 'An error occurred while fetching products.' };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProducts(currentPage.value);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadProducts(page);
  }
};

// Handle CSV file import directly using fetch
const handleFileImport = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('csv', file);
    
    try {
      isLoading.value = true; // Set loading state
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch("http://127.0.0.1:8000/api/import-products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 422) {
          const errorsList = errorData.errors;
          uploadErrors.value = Object.values(errorsList).flat();
          uploadMessage.value = '';
        } else {
          uploadMessage.value = 'Error importing file.';
          uploadErrors.value = [];
        }
        
        throw new Error('Failed to import file');
      }
      
      const data = await response.json();
      
      console.log('File uploaded successfully:', data);
      uploadMessage.value = 'File import in progress ....';
      uploadErrors.value = [];
      
      await loadProducts(currentPage.value); // Reload products after import
    } catch (error) {
      console.error('Error uploading file:', error);
      
      uploadMessage.value = 'Error importing file.';
      uploadErrors.value.push(error.message);
    } finally {
      isLoading.value = false; // Reset loading state
    }
  }
};
</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
