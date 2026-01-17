import api from "../api/axiosConfig.js";

export const userService = {
  getCurrentUser: async () => {
    return api.get("/me");
  },
};

export default userService;
