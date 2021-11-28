import "@babel/polyfill";
import { createInstantSite, editInstantSite, editSiteStatus } from "./sites";
import { login, logout } from "./login";
import { createUser, editUser, toggleColorScheme } from "./users";
import { save, headerChecker, logTable } from "./csv";
import { showAlert } from "./alerts";

// DOM ELEMENTS
const createInstantSiteForm = $("#create-instant-site-form");
const editInstantSiteForm = $("#edit-instant-site-form");
const loginForm = $("#login-form");
const logOutBtn = $("#log-out-button");
const createUserForm = $("#create-user-form");
const editUserForm = $("#edit-user-form");
const colorSchemeBtn = $("#dark-mode-check");
const bulkSiteForm = $("#create-bulk-instant-site-form");
const changeStatusForm = $("#change-status-form");

if (createInstantSiteForm) {
  $(createInstantSiteForm).on("submit", (e) => {
    e.preventDefault();
    const businessName = $("#business-name").val();
    const firstName = $("#first-name").val() || "";
    const lastName = $("#last-name").val();
    const phoneNumber = $("#phone-number").val();
    const cellPhone = $("#cell-phone").val();
    const email = $("#email").val();

    const streetAddress = $("#street-address").val();
    const suite = $("#suite").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zip = $("#zip").val();
    const country = $("#country").val();

    const industry = $('input[name="Industry"]:checked').val();
    createInstantSite(
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
    );
  });
}

if (editInstantSiteForm) {
  const url = new URL(window.location);
  const id = url.pathname.split("/")[3];
  $(editInstantSiteForm).on("submit", (e) => {
    e.preventDefault();
    const businessName = $("#business-name").val();
    const firstName = $("#first-name").val() || "";
    const lastName = $("#last-name").val();
    const phoneNumber = $("#phone-number").val();
    const cellPhone = $("#cell-phone").val();
    const email = $("#email").val();

    const streetAddress = $("#street-address").val();
    const suite = $("#suite").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zip = $("#zip").val();
    const country = $("#country").val();

    editInstantSite(
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
    );
  });
}

if (loginForm) {
  $(loginForm).on("submit", (e) => {
    e.preventDefault();
    const email = $("#email-address").val();
    const password = $("#password").val();

    login(email, password);
  });
}

if (logOutBtn) $(logOutBtn).on("click", logout);

if (createUserForm) {
  $(createUserForm).submit(function (e) {
    e.preventDefault();
    const firstName = $("#first-name").val();
    const lastName = $("#last-name").val();
    const title = $("#title").val();
    const email = $("#email").val();
    const phoneNumber = $("#phone-number").val();
    const role = $("#role").val();

    createUser(firstName, lastName, title, email, phoneNumber, role);
  });
}

if (editUserForm) {
  $(editUserForm).submit(function (e) {
    e.preventDefault();
    const firstName = $("#first-name").val();
    const lastName = $("#last-name").val();
    const title = $("#title").val();
    const email = $("#email").val();
    const phoneNumber = $("#phone-number").val();
    const role = $("#role").val();

    const id = $("form").attr("data-user-id");

    editUser(firstName, lastName, title, email, phoneNumber, role, id);
  });
}

if (colorSchemeBtn) {
  $(colorSchemeBtn).on("change", (e) => {
    e.preventDefault();
    toggleColorScheme();
  });
}

const resetPage = (wrapper) => {
  $(".database-wrapper").empty();
  $(".content-top .upload-button-wrapper").remove();
  $(".content-top").after(wrapper);
  wrapper.css({ opacity: 0 }).animate({ opacity: 1 });
  $initialInnerContentWrapper = $(".inner-content-wrapper").clone(true);
  return $("#file-selected").html("No file selected");
};

if (bulkSiteForm) {
  var tableShown;
  $("#csv-upload").on("change", function () {
    // If no file is selected
    if (!$(this).val()) {
      resetPage($initialInnerContentWrapper);
      return;
    }
    // If file is not a csv
    var ext = $(this).val().split(".").pop().toLowerCase();
    if (ext !== "csv") {
      if (tableShown) {
        resetPage($initialInnerContentWrapper);
        tableShown = false;
      }
      showAlert("error", "Please upload csv file only.");
      return;
    }
    // Test headers
    var headerArray = save();
    console.log(headerArray);
    /* $("input#csv-upload").parse({
      config: {
        preview: 1,
        complete: headerChecker,
      },
    }); */
    // Change displayed file name
    var fileName, fileArray;
    fileArray = $(this).val().split("\\");
    fileName = fileArray[fileArray.length - 1];
    $("#file-selected").html(fileName);
    // Parse the csv
    tableShown = true;
    $("input#csv-upload").parse({
      config: {
        header: true,
        complete: logTable,
      },
      before: function (file, inputElem) {},
      error: function (err, file, inputElem, reason) {},
      complete: function (data) {},
    });
  });
  var $initialInnerContentWrapper = $(".inner-content-wrapper").clone(true);
}

if (changeStatusForm) {
  const url = new URL(window.location);
  const id = url.pathname.split("/")[3];
  var currentStatus = $("#status").val();

  $("#status").on("change", function () {
    if ($(this).val() == currentStatus)
      $("#status-submit").addClass("disabled");
    else $("#status-submit").removeClass("disabled");
  });

  $(changeStatusForm).on("submit", function (e) {
    e.preventDefault();
    if ($("#status").val() == currentStatus) return false;
    const status = $("#status").val();
    editSiteStatus(id, status);
  });
}
