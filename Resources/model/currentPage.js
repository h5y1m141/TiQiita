var currentPage;
currentPage = (function() {
  function currentPage(page) {
    var lastURL, nextURL, selectMenu;
    nextURL = null;
    lastURL = null;
    selectMenu = null;
    if (typeof page !== "undefined" && page !== null) {
      currentPage = page;
    } else {
      currentPage = 1;
    }
  }
  return currentPage;
})();
module.exports = currentPage;