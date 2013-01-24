var getStocksCommand;
getStocksCommand = (function() {
  function getStocksCommand() {}
  getStocksCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    items = JSON.parse(Ti.App.Properties.getString('storedStocks'));
    if (items !== null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(t.createRow(json));
      }
      result.push(t.createRowForLoadOldEntry('storedStocks'));
    } else {
      this.getFeed();
    }
    return mainTable.setData(result);
  };
  getStocksCommand.prototype.getFeed = function() {
    var rows;
    rows = [];
    actInd.message = 'loading...';
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.show();
    return qiita.getFeed(function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(t.createRow(json));
      }
      rows.push(t.createRowForLoadOldEntry('storedStocks'));
      mainTable.setData(rows);
      actInd.hide();
      return true;
    });
  };
  return getStocksCommand;
})();
module.exports = getStocksCommand;