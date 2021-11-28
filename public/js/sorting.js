var url = new URL(window.location);

$(".database-table th").on("click", function () {
  var order = url.searchParams.get("order");
  if ($(this).attr("data-active") == "true") {
    if (order == "asc") {
      url.searchParams.set("order", "desc");
    } else url.searchParams.set("order", "asc");
  } else {
    var field = $(this).attr("data-field");
    url.searchParams.set("sort", field);
    url.searchParams.set("order", "desc");
  }
  url.searchParams.delete("page");
  window.location = url.href;
});
