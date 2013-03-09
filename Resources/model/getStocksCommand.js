var getStocksCommand;

getStocksCommand = (function() {

  function getStocksCommand() {
    this.value = 'storedStocks';
    this.direction = "vertical";
  }

  getStocksCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    this._showStatusView();
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
      this._hideStatusView();
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(this.value));
    } else {
      this.getFeed();
    }
    return mainTable.setData(result);
  };

  getStocksCommand.prototype.getFeed = function() {
    var rows, value,
      _this = this;
    rows = [];
    value = this.value;
    qiita.getFeed(function(result, links) {
      var json, _i, _len;
      _this._hideStatusView();
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      rows.push(mainTableView.createRowForLoadOldEntry(value));
      return mainTable.setData(rows);
    });
    return true;
  };

  getStocksCommand.prototype._showStatusView = function() {
    Ti.API.info("データの読み込み。statusView表示");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    return mainContoroller.slideMainTable(this.direction);
  };

  getStocksCommand.prototype._hideStatusView = function() {
    Ti.API.info("データの読み込みが完了したらstatusViewを元に戻す");
    Ti.App.Properties.setBool("stateMainTableSlide", true);
    return mainContoroller.slideMainTable(this.direction);
  };

  return getStocksCommand;

})();

module.exports = getStocksCommand;
