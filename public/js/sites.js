import axios from "axios";
import { showAlert } from "./alerts";

export const createInstantSite = async (
  businessName,
  firstName,
  lastName,
  phoneNumber,
  cellPhone,
  email,
  streetAddress,
  suite,
  city,
  state,
  zip,
  country,
  industry
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/sites",
      data: {
        businessName,
        firstName,
        lastName,
        phoneNumber,
        cellPhone,
        email,
        streetAddress,
        suite,
        city,
        state,
        zip,
        country,
        industry,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Instant Site Created!");
      window.setTimeout(() => {
        location.assign(
          `/instant-sites/sites/${res.data.data.newSite.customId}/${res.data.data.newSite.slug}`
        );
      }, 1750);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const editInstantSite = async (
  businessName,
  firstName,
  lastName,
  phoneNumber,
  cellPhone,
  email,
  streetAddress,
  suite,
  city,
  state,
  zip,
  country,
  id
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/sites/${id}`,
      data: {
        businessName,
        firstName,
        lastName,
        phoneNumber,
        cellPhone,
        email,
        streetAddress,
        suite,
        city,
        state,
        zip,
        country,
        browser: true,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Edit Successful");
      window.setTimeout(() => {
        location.assign(
          `/instant-sites/sites/${res.data.data.site.customId}/${res.data.data.site.slug}`
        );
      }, 1750);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const editSiteStatus = async (id, status) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/sites/${id}`,
      data: {
        status,
        browser: true,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", `Status changed to ${res.data.data.site.status}`);
      window.setTimeout(() => {
        location.reload();
      }, 1750);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
