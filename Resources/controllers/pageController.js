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
  pageController.prototype.showCurrentStatus = function() {
    return this.pageStatus.showCurrentStatus();
  };
  pageController.prototype.useStoredStock = function() {
    var statusObj;
    statusObj = this.pageStatus.lists[0];
    return this.pageStatus.use(statusObj);
  };
  pageController.prototype.useStoredMyStock = function() {
    var statusObj;
    statusObj = this.pageStatus.lists[1];
    return this.pageStatus.use(statusObj);
  };
  pageController.prototype.use = function(storedTo) {
    return this.pageStatus.use(storedTo);
  };
  pageController.prototype.set = function(obj) {
    return this.pageStatus.set(obj);
  };
  return pageController;
})();
module.exports = pageController;