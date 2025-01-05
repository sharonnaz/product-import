import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      errors: {},
    };
  },
  actions: {
    /******************* Get authenticated user *******************/
    async getUser() {
      if (localStorage.getItem("token")) {
        const res = await fetch("/api/user", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.user = data;
        }
      }
    },
    /******************* Login or Register user *******************/
    async authenticate(apiRoute, formData) {
      try {
        const res = await fetch(`/api/${apiRoute}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
    
        if (data.success) {
          // Clear any previous errors
          this.errors = {};
    
          // Store the token in localStorage
          localStorage.setItem("token", data.data.token);
    
          // Set the authenticated user details
          this.user = { name: data.data.name };
    
          // Navigate to the home page
          this.router.push({ name: "products" });
        } else {
          // Handle non-successful response
          this.errors = { message: data.message || "An error occurred" };
        }
      } catch (error) {
        // Handle network or unexpected errors
        this.errors = { message: "Unable to connect to the server." };
        console.error("Authentication error:", error);
      }
    },
    
    /******************* Logout user *******************/
    async logout() {
      try {
        const res = await fetch("/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
    
        const data = await res.json();
        console.log(data);
    
        if (data.success) {
          // Clear user data and token on successful logout
          this.user = null;
          this.errors = {};
          localStorage.removeItem("token");
    
          // Redirect to the home page
          this.router.push({ name: "login" });
        } else {
          // Handle case where logout did not succeed as expected
          this.errors = { message: data.message || "Failed to log out." };
        }
      } catch (error) {
        // Handle network or unexpected errors
        this.errors = { message: "An error occurred while logging out." };
        console.error("Logout error:", error);
      }
    },
  },
});
