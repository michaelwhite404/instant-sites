var url = new URL(window.location);

$(".pagination-container .material-icons").on("click", function () {
  if ($(this).attr("data-select") === "true") {
    if ($(this).hasClass("first-page")) {
      url.searchParams.delete("page");
    } else {
      var page = $(this).attr("data-page");
      if (page == 1) url.searchParams.delete("page");
      else url.searchParams.set("page", page);
    }
    window.location = url.href;
  }
});

$("select.rows-picker").on("change", function () {
  var value = $("select.rows-picker").val();
  if (value == 25) {
    url.searchParams.delete("limit");
  } else {
    var limit = value;
    url.searchParams.set("limit", limit);
  }
  url.searchParams.delete("page");
  window.location = url.href;
});
