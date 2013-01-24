var getMyStocksCommand;
getMyStocksCommand = (function() {
  function getMyStocksCommand() {}
  getMyStocksCommand.prototype.execute = function() {
    var items, json, result, showFlg, _i, _len;
    result = [];
    items = JSON.parse(Ti.App.Properties.getString('storedMyStocks'));
    if (items !== null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(t.createRow(json));
      }
      result.push(t.createRowForLoadOldEntry('storedMyStocks'));
    } else {
      showFlg = false;
      this.getMyStocks(showFlg);
    }
    return mainTable.setData(result);
  };
  getMyStocksCommand.prototype.getMyStocks = function(showFlg) {
    var MAXITEMCOUNT, rows;
    actInd.message = 'loading...';
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.zIndex = 10;
    actInd.show();
    rows = [];
    MAXITEMCOUNT = 20;
    qiita.getMyStocks(function(result) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(t.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
      } else {
        Ti.API.info("loadOldEntry show");
        rows.push(t.createRowForLoadOldEntry('storedMyStocks'));
      }
      actInd.hide();
      if (showFlg === true) {
        return mainTable.setData(rows);
      } else {

      }
    });
    return true;
  };
  return getMyStocksCommand;
})();
module.exports = getMyStocksCommand;