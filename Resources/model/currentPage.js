var currentPage;
currentPage = (function() {
  function currentPage() {
    this.lists = [];
    this.status = null;
    this.item = null;
  }
  currentPage.prototype.use = function(label) {
    var list, _i, _len, _ref;
    if (label !== "followingTags") {
      _ref = this.lists;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        list = _ref[_i];
        if (list.label === label) {
          this.item = list;
        }
      }
    }
    return this.item;
  };
  currentPage.prototype.set = function(obj) {
    var list, matchItems, _, _i, _len, _ref;
    _ = require("lib/underscore-min");
    Ti.API.info("set current Page object. label is " + obj.label);
    matchItems = _.where(this.lists, {
      "label": obj.label
    });
    if (matchItems.length === 0) {
      this.lists.push(obj);
    } else {
      _ref = this.lists;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        list = _ref[_i];
        if (list.label === obj.label) {
          list.nextURL = obj.nextURL;
        }
      }
    }
    return true;
  };
  currentPage.prototype.showLists = function() {
    var list, _i, _len, _ref, _results;
    _ref = this.lists;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      _results.push(Ti.API.info("currentPage showLists. " + list.label + " and  " + list.nextURL));
    }
    return _results;
  };
  return currentPage;
})();
module.exports = currentPage;