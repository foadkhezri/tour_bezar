var url = window.location;
if (url == "http://localhost:3000/") {
  $(".navbar").addClass("fixed-top bg-transparent");
} else {
  $(".navbar").addClass("sticky-top");
}
// Will also work for relative and absolute hrefs
$("ul.navbar-nav a")
  .filter(function() {
    return this.href == url;
  })
  .parent()
  .addClass("active");

// input validation

var inputs, index;

inputs = document.getElementsByTagName("input");
for (index = 0; index < inputs.length; ++index) {
  inputs[index].oninvalid = function() {
    this.setCustomValidity("فیلد را کامل کنید");
  };
  inputs[index].oninput = function() {
    this.setCustomValidity("");
  };
}
