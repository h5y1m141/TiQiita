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
        result.push(t.createRow(json));
      }
      result.push(t.createRowForLoadOldEntry(this.value));
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
      commandController.countUp(progressBar);
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(t.createRow(json));
      }
      rows.push(t.createRowForLoadOldEntry(value));
      return mainTable.setData(rows);
    });
    return true;
  };
  return getStocksCommand;
})();
module.exports = getStocksCommand;