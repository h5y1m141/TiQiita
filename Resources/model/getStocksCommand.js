var getStocksCommand;
getStocksCommand = (function() {
  function getStocksCommand() {
    this.value = 'storedStocks';
  }
  getStocksCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
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
    var rows, value;
    rows = [];
    value = this.value;
    qiita.getFeed(function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      rows.push(mainTableView.createRowForLoadOldEntry(value));
      mainTable.setData(rows);
      return Ti.App.Properties.setBool("stateMainTableSlide", false);
    });
    return true;
  };
  return getStocksCommand;
})();
module.exports = getStocksCommand;