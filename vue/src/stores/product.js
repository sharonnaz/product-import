import { defineStore } from "pinia";

export const useProductsStore = defineStore("productsStore", {
  state: () => ({
    products: [],
    errors: null,
    uploadMessage: '',
    uploadErrors: [],
  }),

  actions: {
    async fetchProducts(page = 1) {
      const formData = new FormData();
      formData.append('page', page);

      try {
        console.log('Fetching products for page:', page);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const res = await fetch("/api/list-products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);

        if (res.ok) {
          this.products = data.data;
          this.errors = null;
          return data;
        } else {
          this.errors = data.errors || { message: "Failed to fetch products." };
          return null;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.errors = { message: "Network or server error" };
        throw error;
      }
    },

  },
});
