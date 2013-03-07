var getMyStocksCommand;

getMyStocksCommand = (function() {

  function getMyStocksCommand() {
    this.value = 'storedMyStocks';
  }

  getMyStocksCommand.prototype.execute = function() {
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
      this.getMyStocks();
    }
    return mainTable.setData(result);
  };

  getMyStocksCommand.prototype.getMyStocks = function() {
    var MAXITEMCOUNT, direction, rows, value;
    rows = [];
    MAXITEMCOUNT = 20;
    value = this.value;
    direction = "vertical";
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    mainContoroller.slideMainTable(direction);
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
      Ti.App.Properties.setBool("stateMainTableSlide", true);
      return mainContoroller.slideMainTable(direction);
    });
    return true;
  };

  return getMyStocksCommand;

})();

module.exports = getMyStocksCommand;
