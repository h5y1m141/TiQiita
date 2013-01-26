var pageController;
pageController = (function() {
  function pageController() {
    var currentPage;
    currentPage = require('model/currentPage');
    this.pageStatus = new currentPage();
  }
  pageController.prototype.showLists = function() {
    return this.pageStatus.showLists();
  };
  pageController.prototype.set = function(obj) {
    return this.pageStatus.set(obj);
  };
  return pageController;
})();
module.exports = pageController;