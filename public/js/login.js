import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      if (!res.data.data.user.passwordChangedAt) {
        window.setTimeout(() => {
          location.assign("/new-password");
        }, 1500);
      } else {
        window.setTimeout(() => {
          location.assign("/dashboard");
        }, 1500);
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async (e) => {
  try {
    e.preventDefault();
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      window.location.assign("/");
    }
  } catch (err) {
    showAlert("error", "Error logging out! Try again");
  }
};
