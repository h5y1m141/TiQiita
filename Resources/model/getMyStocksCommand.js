var getMyStocksCommand;
getMyStocksCommand = (function() {
  function getMyStocksCommand() {
    this.value = 'storedMyStocks';
  }
  getMyStocksCommand.prototype.execute = function() {
    var items, json, result, showFlg, _i, _len;
    result = [];
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(t.createRow(json));
      }
      result.push(t.createRowForLoadOldEntry(this.value));
    } else {
      showFlg = false;
      this.getMyStocks(showFlg);
    }
    return mainTable.setData(result);
  };
  getMyStocksCommand.prototype.getMyStocks = function(showFlg) {
    var MAXITEMCOUNT, rows;
    rows = [];
    MAXITEMCOUNT = 20;
    qiita.getMyStocks(function(result, links) {
      var json, lastURL, link, nextURL, _i, _j, _len, _len2, _obj;
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        if (link["rel"] === 'next') {
          nextURL = link["url"];
        } else if (link["rel"] === 'last') {
          lastURL = link["url"];
        }
      }
      _obj = {
        label: this.value,
        nextURL: nextURL,
        lastURL: lastURL
      };
      pageController.set(_obj);
      for (_j = 0, _len2 = result.length; _j < _len2; _j++) {
        json = result[_j];
        rows.push(t.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
      } else {
        Ti.API.info("loadOldEntry show");
        rows.push(t.createRowForLoadOldEntry(this.value));
      }
      commandController.countUp(progressBar);
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