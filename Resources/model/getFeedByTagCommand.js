var getFeedByTagCommand,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

getFeedByTagCommand = (function(_super) {

  __extends(getFeedByTagCommand, _super);

  function getFeedByTagCommand(tagName) {
    this.tagName = tagName;
    this.direction = "vertical";
  }

  getFeedByTagCommand.prototype.execute = function() {
    var items, json, result, storedTo, _i, _len;
    result = [];
    Ti.API.debug(this._currentSlideState());
    storedTo = "followingTag" + this.tagName;
    items = JSON.parse(Ti.App.Properties.getString(storedTo));
    if (items !== null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(storedTo));
    } else {
      this.getFeedByTag();
    }
    return mainTable.setData(result);
  };

  getFeedByTagCommand.prototype.getFeedByTag = function() {
    var MAXITEMCOUNT, rows, storedTo,
      _this = this;
    rows = [];
    MAXITEMCOUNT = 20;
    storedTo = "followingTag" + this.tagName;
    qiita.getFeedByTag(this.tagName, function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {

      } else {
        rows.push(mainTableView.createRowForLoadOldEntry(storedTo));
      }
      return mainTable.setData(rows);
    });
    return true;
  };

  getFeedByTagCommand.prototype._currentSlideState = function() {
    return getFeedByTagCommand.__super__._currentSlideState.call(this);
  };

  getFeedByTagCommand.prototype._showStatusView = function() {
    return getFeedByTagCommand.__super__._showStatusView.call(this);
  };

  getFeedByTagCommand.prototype._hideStatusView = function() {
    return getFeedByTagCommand.__super__._hideStatusView.call(this);
  };

  return getFeedByTagCommand;

})(baseCommand);

module.exports = getFeedByTagCommand;
