var currentPage;
currentPage = (function() {
  function currentPage() {
    this.lists = [
      {
        label: "storedStock",
        nextURL: null,
        lastURL: null
      }, {
        label: "storedMyStocks",
        nextURL: null,
        lastURL: null
      }
    ];
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
  currentPage.prototype.set = function(obj) {
    if (this.exists(obj.label) !== true) {
      return this.lists.push(obj);
    } else {
      return this.edit(obj);
    }
  };
  currentPage.prototype.edit = function(obj) {
    var list, _i, _len, _ref, _results;
    _ref = this.lists;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      _results.push(list.label === obj.label ? (list.label = obj.label, list.nextURL = obj.nextURL, list.lastURL = obj.lastURL) : void 0);
    }
    return _results;
  };
  currentPage.prototype.showLists = function() {
    return this.lists;
  };
  return currentPage;
})();
module.exports = currentPage;