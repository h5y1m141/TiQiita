var currentPage;
currentPage = (function() {
  function currentPage() {
    this.lists = [];
    this.status = null;
    this.item = {};
  }
  currentPage.prototype.use = function(label) {
    var list, _i, _len, _ref;
    Ti.API.info("currentPage.use() start. label is " + label + " @lists is " + this.lists.length + " ");
    if (this.lists.length === 0) {
      this.status = label;
    } else {
      _ref = this.lists;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        list = _ref[_i];
        if (list.label === label) {
          this.status = list.label;
          this.item = list;
        }
      }
    }
    return Ti.API.info("currentPage done @item is " + this.item);
  };
  currentPage.prototype.set = function(obj) {
    var list, matchItems, _, _i, _len, _ref;
    _ = require("lib/underscore-min");
    matchItems = _.where(this.lists, {
      "label": obj.label
    });
    if (matchItems.length === 0) {
      this.lists.push(obj);
      this.item = list;
    } else {
      _ref = this.lists;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        list = _ref[_i];
        if (list.label === obj.label) {
          list.nextURL = obj.nextURL;
          list.lastURL = obj.lastURL;
        }
      }
    }
    return Ti.API.info("obj nextURL is " + obj.nextURL + " and matchItems is " + matchItems + " and @lists is " + this.lists);
  };
  currentPage.prototype.showLists = function() {
    return Ti.API.info(this.lists);
  };
  currentPage.prototype.showCurrentStatus = function() {
    return Ti.API.info(this.status);
  };
  currentPage.prototype.getList = function() {
    var list, noList, obj, _i, _len, _ref;
    Ti.API.info("currentPage getList start @lists is " + this.lists + " and @status is " + this.status);
    _ref = this.lists;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      Ti.API.info(list.label);
      if (list.label === this.status) {
        obj = list;
      } else {
        noList = {
          label: "noList",
          nextURL: null,
          lastURL: null
        };
        obj = noList.label;
      }
    }
    return obj;
  };
  return currentPage;
})();
module.exports = currentPage;