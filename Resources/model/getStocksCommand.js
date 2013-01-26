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
    var rows;
    rows = [];
    actInd.message = 'loading...';
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.show();
    return qiita.getFeed(function(result, links) {
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
      commandController.countUp(progressBar);
      for (_j = 0, _len2 = result.length; _j < _len2; _j++) {
        json = result[_j];
        rows.push(t.createRow(json));
      }
      rows.push(t.createRowForLoadOldEntry(this.value));
      mainTable.setData(rows);
      actInd.hide();
      return true;
    });
  };
  return getStocksCommand;
})();
module.exports = getStocksCommand;