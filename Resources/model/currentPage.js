var currentPage;
currentPage = (function() {
  function currentPage() {
    var fsStore;
    this.lists = [];
    this.status = null;
    fsStore = require('lib/fs-store');
    qiitaDB.use('store', fsStore);
    qiitaDB.collection('localItems');
    this.localItems = qiitaDB.collection;
  }
  currentPage.prototype.use = function(label) {
    var list, _i, _len, _ref;
    Ti.API.info("currentPage.use() start. label is " + label + " @lists is " + this.lists.length + " @status is " + this.status);
    _ref = this.lists;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      Ti.API.info("currentPage.use loop. list.label is " + list.label);
      if (list.label === label) {
        this.status = list.label;
      }
    }
    return Ti.API.info("currentPage done @status is " + this.status);
  };
  currentPage.prototype.set = function(obj) {
    return Ti.API.info("currentPage.set start. obj is " + obj.label);
  };
  currentPage.prototype.showLists = function() {
    return Ti.API.info(this.lists);
  };
  currentPage.prototype.showCurrentStatus = function() {
    return Ti.API.info(this.status);
  };
  return currentPage;
})();
module.exports = currentPage;