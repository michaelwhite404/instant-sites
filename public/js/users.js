import axios from "axios";
import { showAlert } from "./alerts";

export const createUser = async (
  firstName,
  lastName,
  title,
  email,
  phoneNumber,
  role
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/create-user",
      data: {
        firstName,
        lastName,
        title,
        email,
        phoneNumber,
        role,
      },
    });

    if (res.data.status === "success") {
      showAlert(
        "success",
        "User Created! A password has been sent to the user's email."
      );
      window.setTimeout(() => {
        location.assign(`/users/${res.data.data.newUser.slug}`);
      }, 1750);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const editUser = async (
  firstName,
  lastName,
  title,
  email,
  phoneNumber,
  role,
  id
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/${id}`,
      data: {
        firstName,
        lastName,
        title,
        email,
        phoneNumber,
        role,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "User Updated!");
      window.setTimeout(() => {
        location.assign(`/users/${res.data.data.user.slug}`);
      }, 1750);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const toggleColorScheme = async () => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/color-scheme",
    });
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
