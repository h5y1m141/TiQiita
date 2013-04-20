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
    storedTo = "followingTag" + this.tagName;
    items = JSON.parse(Ti.App.Properties.getString(storedTo));
    if ((items != null) === false || items === "") {
      return this.getFeedByTag();
    } else {
      items.sort(function(a, b) {
        if (moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm")) {
          return -1;
        } else {
          return 1;
        }
      });
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(storedTo));
      mainTable.setData(result);
      return this._hideStatusView();
    }
  };

  getFeedByTagCommand.prototype.getFeedByTag = function() {
    var MAXITEMCOUNT, rows, storedTo,
      _this = this;
    rows = [];
    MAXITEMCOUNT = 20;
    storedTo = "followingTag" + this.tagName;
    this._showStatusView();
    qiita.getFeedByTag(this.tagName, function(result, links) {
      var json, _i, _len;
      result.sort(function(a, b) {
        if (moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm")) {
          return -1;
        } else {
          return 1;
        }
      });
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
      } else {
        rows.push(mainTableView.createRowForLoadOldEntry(storedTo));
      }
      mainTable.setData(rows);
      return _this._hideStatusView();
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
