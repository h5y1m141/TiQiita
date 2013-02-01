var currentPage;
currentPage = (function() {
  function currentPage() {
    this.lists = [];
    this.status = null;
  }
  currentPage.prototype.exists = function(label) {
    var list, _i, _len, _ref;
    _ref = this.lists;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      if (list.label === label) {
        return true;
      }
    }
  };
  currentPage.prototype.use = function(label) {
    var list, noList, _i, _len, _ref;
    _ref = this.lists;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      if (list.label === label) {
        return this.status = list;
      } else {
        noList = {
          label: "noList",
          nextURL: null,
          lastURL: null
        };
        return this.status = noList;
      }
    }
  };
  currentPage.prototype.set = function(obj) {
    Ti.API.info("currentPage.set start. obj is " + obj.label);
    if (this.exists(obj.label) !== true && obj.label !== "undefined") {
      this.lists.push(obj);
    } else {
      this.edit(obj);
    }
    return this.status = obj;
  };
  currentPage.prototype.edit = function(obj) {
    var list, _i, _len, _ref;
    Ti.API.info("currentPage.edit start");
    _ref = this.lists;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      if (list.label === obj.label) {
        list.label = obj.label;
        list.nextURL = obj.nextURL;
        list.lastURL = obj.lastURL;
      }
    }
    return Ti.API.info("currentPage.edit done. nextURL is " + list.nextURL);
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