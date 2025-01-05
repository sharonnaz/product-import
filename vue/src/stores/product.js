import { defineStore } from "pinia";

export const useProductsStore = defineStore("productsStore", {
  state: () => ({
    products: [],
    errors: null,
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

    async importCSV(file) {
      // Create a new FormData instance
      const formData = new FormData();
  
      // Add the file with 'csv' as the key
      formData.append('csv', file, file.name);
  
      // Log the FormData entries to verify the file is attached
      for (let [key, value] of formData.entries()) {
          console.log('FormData entry:', key, value instanceof File ? {
              name: value.name,
              type: value.type,
              size: value.size
          } : value);
      }
  
      try {
          console.log('Starting CSV import');
          const token = localStorage.getItem("token");
  
          if (!token) {
              throw new Error('No authentication token found');
          }
  
          // Make sure we're using the correct API URL
          const url = import.meta.env.VITE_API_URL ? 
              `${import.meta.env.VITE_API_URL}/api/import-products` : 
              '/api/import-products';
  
          console.log('Sending request to:', url);
  
          const res = await fetch(url, {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${token}`,
                  // Do not manually set Content-Type; it will be set automatically by FormData
              },
              body: formData,
          });
  
          console.log('Response status:', res.status);
          const data = await res.json();
          console.log('Response data:', data);
  
          if (res.ok) {
              this.errors = null;
              return data;
          } else {
              this.errors = data.errors || { message: "Failed to import CSV." };
              throw { response: { status: res.status, data } };
          }
      } catch (error) {
          console.error('Detailed import error:', error);
  
          // If it's a network error
          if (!error.response) {
              this.errors = { message: "Network error occurred while importing CSV" };
          }
          throw error;
      }
  }
  
  },
});