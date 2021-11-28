export const logTable = (results) => {
  const csvData = results.data;
  console.log(csvData);
  $(".database-wrapper").empty();
  if ($(".content-top .upload-button-wrapper").length == 0) {
    var $uploadButtonWrapperClone = $(".upload-button-wrapper").clone(true);
    $uploadButtonWrapperClone
      .find(".upload-button")
      .css({ width: "45px", height: "45px" });
    $uploadButtonWrapperClone
      .find("svg")
      .attr("width", "20px")
      .attr("height", "20px");
    $(".inner-content-wrapper").remove();
    $uploadButtonWrapperClone
      .appendTo(".content-top")
      .css({ opacity: 0 })
      .animate({ opacity: 1 }, 1500);
  }
  var $csvTableHTML = $("<table class='database-table' id='bulk-site-create'>");
  const thArray = [
    "Business Name",
    "Phone",
    "Email",
    "Address",
    "Suite",
    "City",
    "State",
    "Zip",
    "Country",
  ];
  var tableHeadDatas;
  $.each(thArray, (index, value) => {
    tableHeadDatas += `<th>${value}</th>`;
  });
  $csvTableHTML
    .append("<thead>")
    .children("thead")
    .append("<tr>")
    .children("tr")
    .append(tableHeadDatas);

  var tableBodyRows;
  $.each(csvData, (index, value) => {
    tableBodyRows += "<tr>";
    tableBodyRows += `<td title='${value.Name || ""}'>${value.Name || ""}</td>`;
    tableBodyRows += `<td title='${value.Phone || ""}'>${
      value.Phone || ""
    }</td>`;
    tableBodyRows += `<td title='${value.Email || ""}'>${
      value.Email || ""
    }</td>`;
    tableBodyRows += `<td title='${value.Address || ""}'>${
      value.Address || ""
    }</td>`;
    tableBodyRows += `<td title='${value.Suite || ""}'>${
      value.Suite || ""
    }</td>`;
    tableBodyRows += `<td title='${value.City || ""}'>${value.City || ""}</td>`;
    tableBodyRows += `<td title='${value.State || ""}'>${
      value.State || ""
    }</td>`;
    tableBodyRows += `<td title='${value.Zip || ""}'>${value.Zip || ""}</td>`;
    tableBodyRows += `<td></td>`;
    tableBodyRows += "</tr>";
  });
  $csvTableHTML.append("<tbody>").children("tbody").append(tableBodyRows);
  $csvTableHTML
    .append("<tfoot>")
    .children("tfoot")
    .append("<tr>")
    .children("tr")
    .append("<td colspan='9'>")
    .children("td")
    .append("<div class='tfoot-container'>")
    .children("div");
  $csvTableHTML.appendTo($(".database-wrapper"));
  $(".database-table tbody").overlayScrollbars({});
  if ($("body").hasClass("dark")) {
    if ($(".os-host")) {
      $(".os-host").removeClass("os-theme-dark");
      $(".os-host").addClass("os-theme-light");
    }
  }
  return csvData;
};

export const headerChecker = (results) => {
  console.log(results, "HERE");

  const target = [
    "businessName",
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "cellPhone",
    "streetAddress",
    "suite",
    "city",
    "state",
    "zip",
    "country",
  ];
  target.every((v) => results.includes(v));
};

export const save = () => {
  var arr = [],
    bool;
  $("input#csv-upload").parse({
    config: {
      preview: 1,
      complete: function (results) {
        $.each(results.data[0], (index, value) => {
          arr[index] = value;
        });

        return headerChecker(arr);
      },
    },
  });
};
