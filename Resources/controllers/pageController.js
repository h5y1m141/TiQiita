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
    var list, lists, _i, _len;
    lists = this.pageStatus.lists;
    for (_i = 0, _len = lists.length; _i < _len; _i++) {
      list = lists[_i];
      if (list.label = "storedStocks") {
        return this.pageStatus.use(list.label);
      }
    }
  };
  pageController.prototype.useStoredMyStock = function() {
    var list, lists, _i, _len;
    lists = this.pageStatus.lists;
    for (_i = 0, _len = lists.length; _i < _len; _i++) {
      list = lists[_i];
      if (list.label = "storedMyStocks") {
        return this.pageStatus.use(list.label);
      }
    }
  };
  pageController.prototype.use = function(storedTo) {
    return this.pageStatus.use(storedTo);
  };
  pageController.prototype.set = function(obj) {
    return this.pageStatus.set(obj);
  };
  pageController.prototype.getStatus = function() {
    return this.pageStatus.status;
  };
  pageController.prototype.getList = function() {
    return this.pageStatus.getList();
  };
  return pageController;
})();
module.exports = pageController;