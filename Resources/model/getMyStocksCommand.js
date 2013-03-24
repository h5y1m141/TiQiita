var getMyStocksCommand,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

getMyStocksCommand = (function(_super) {

  __extends(getMyStocksCommand, _super);

  function getMyStocksCommand() {
    this.value = 'storedMyStocks';
    this.direction = "vertical";
  }

  getMyStocksCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    Ti.API.debug(this._currentSlideState());
    this._showStatusView();
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
      if (this._currentSlideState() === "default") {
        this._showStatusView();
      } else {
        this._hideStatusView();
      }
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(this.value));
    } else {
      this.getMyStocks();
    }
    return mainTable.setData(result);
  };

  getMyStocksCommand.prototype.getMyStocks = function() {
    var MAXITEMCOUNT, rows, value,
      _this = this;
    rows = [];
    MAXITEMCOUNT = 20;
    value = this.value;
    qiita.getMyStocks(function(result, links) {
      var json, _i, _len;
      _this._hideStatusView();
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
      } else {
        Ti.API.info("loadOldEntry show");
        rows.push(mainTableView.createRowForLoadOldEntry(value));
      }
      return mainTable.setData(rows);
    });
    return true;
  };

  getMyStocksCommand.prototype._currentSlideState = function() {
    return getMyStocksCommand.__super__._currentSlideState.call(this);
  };

  getMyStocksCommand.prototype._showStatusView = function() {
    return getMyStocksCommand.__super__._showStatusView.call(this);
  };

  getMyStocksCommand.prototype._hideStatusView = function() {
    return getMyStocksCommand.__super__._hideStatusView.call(this);
  };

  return getMyStocksCommand;

})(baseCommand);

module.exports = getMyStocksCommand;
