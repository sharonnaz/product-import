import { defineStore } from "pinia";

export const useProductsStore = defineStore("productsStore", {
  state: () => ({
    products: [],
    errors: null,
    uploadMessage: '',
    uploadErrors: [],
  }),

  actions: {
    /******************* List Products Api *******************/
    async fetchProducts(page = 1) {
      const formData = new FormData();
      formData.append('page', page);

      try {
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

        const data = await res.json();
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

  /******************* File Import Api *******************/
    async importCSV(file) {
      const formData = new FormData();
      formData.append('csv', file);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const res = await fetch("/api/import-products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          this.uploadMessage = "File imported successfully!";
          this.uploadErrors = [];
          return data;
        } else {
          if (res.status === 422 && data.errors) {
            this.uploadErrors = Object.values(data.errors).flat();
          } else {
            this.uploadErrors = [];
          }
          this.uploadMessage = "Error importing file.";
          throw new Error("Failed to import file");
        }
      } catch (error) {
        console.error('Error importing file:', error);
        this.uploadMessage = "Error importing file.";
        this.uploadErrors.push(error.message);
        throw error;
      }
    },
  },
});
