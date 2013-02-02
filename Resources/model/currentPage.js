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
      Ti.API.info("currentPage exists. list.label is " + list.label);
      if (list.label === label) {
        return true;
      }
    }
  };
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
    Ti.API.info("currentPage.set start. obj is " + obj.label);
    if (this.exists(obj.label) !== true && obj.label !== "undefined") {
      Ti.API.info("currentPage @lists.push start. obj label is " + obj.label);
      this.lists.push(obj);
    } else {
      this.edit(obj);
    }
    return this.status = obj.label;
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
    Ti.API.info("currentPage.edit done. label is " + list.label + " . nextURL is " + list.nextURL + " @lists length is " + this.lists.length);
    return true;
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