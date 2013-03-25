var getStocksCommand,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

getStocksCommand = (function(_super) {

  __extends(getStocksCommand, _super);

  function getStocksCommand() {
    this.value = 'storedStocks';
    this.direction = "vertical";
  }

  getStocksCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
      Ti.API.debug("load cached item and mainTable reset");
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(this.value));
      mainTable.setData(result);
      return this._hideStatusView();
    } else {
      return this.getFeed();
    }
  };

  getStocksCommand.prototype.getFeed = function() {
    var rows, value,
      _this = this;
    Ti.API.debug("getFeed start");
    rows = [];
    value = this.value;
    this._showStatusView();
    qiita.getFeed(function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      rows.push(mainTableView.createRowForLoadOldEntry(value));
      mainTable.setData(rows);
      return _this._hideStatusView();
    });
    return true;
  };

  getStocksCommand.prototype._currentSlideState = function() {
    return getStocksCommand.__super__._currentSlideState.call(this);
  };

  getStocksCommand.prototype._showStatusView = function() {
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

  getStocksCommand.prototype._hideStatusView = function() {
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

  return getStocksCommand;

})(baseCommand);

module.exports = getStocksCommand;
