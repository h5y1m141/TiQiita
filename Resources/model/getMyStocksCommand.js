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
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(this.value));
      this._hideStatusView();
      return mainTable.setData(result);
    } else {
      return this.getMyStocks();
    }
  };

  getMyStocksCommand.prototype.getMyStocks = function() {
    var MAXITEMCOUNT, rows, value,
      _this = this;
    rows = [];
    MAXITEMCOUNT = 20;
    value = this.value;
    this._showStatusView();
    qiita.getMyStocks(function(result, links) {
      var json, _i, _len;
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
      mainTable.setData(rows);
      return _this._hideStatusView();
    });
    return true;
  };

  getMyStocksCommand.prototype._currentSlideState = function() {
    return getMyStocksCommand.__super__._currentSlideState.call(this);
  };

  getMyStocksCommand.prototype._showStatusView = function() {
    Ti.API.info("[ACTION] スライド開始");
    progressBar.value = 0;
    progressBar.show();
    return statusView.animate({
      duration: 400,
      top: 0
    }, function() {
      Ti.API.debug("mainTable を上にずらす");
      return mainTable.animate({
        duration: 200,
        top: 50
      });
    });
  };

  getMyStocksCommand.prototype._hideStatusView = function() {
    Ti.API.info("[ACTION] スライドから標準状態に戻る。垂直方向");
    return mainTable.animate({
      duration: 200,
      top: 0
    }, function() {
      Ti.API.debug("mainTable back");
      progressBar.hide();
      return statusView.animate({
        duration: 400,
        top: -50
      });
    });
  };

  return getMyStocksCommand;

})(baseCommand);

module.exports = getMyStocksCommand;
