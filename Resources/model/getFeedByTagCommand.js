var getFeedByTagCommand;
getFeedByTagCommand = (function() {
  function getFeedByTagCommand(tagName) {
    this.tagName = tagName;
  }
  getFeedByTagCommand.prototype.execute = function() {
    var items, json, result, storedTo, _i, _len;
    storedTo = "followingTag" + this.tagName;
    Ti.API.info("getFeedByTagCommand execute! storedTo is " + storedTo);
    result = [];
    items = JSON.parse(Ti.App.Properties.getString(storedTo));
    if (items !== null) {
      Ti.API.info("cache loaded. items is " + items.length);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      result.push(mainTableView.createRowForLoadOldEntry(storedTo));
    } else {
      Ti.API.info("" + storedTo + " isn't cached so that get items via Qiita API");
      this.getFeedByTag();
    }
    return mainTable.setData(result);
  };
  getFeedByTagCommand.prototype.getFeedByTag = function() {
    var MAXITEMCOUNT, direction, rows, storedTo;
    rows = [];
    MAXITEMCOUNT = 20;
    storedTo = "followingTag" + this.tagName;
    direction = "vertical";
    Ti.App.Properties.setBool('stateMainTableSlide', false);
    controller.slideMainTable(direction);
    qiita.getFeedByTag(this.tagName, function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(mainTableView.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
      } else {
        Ti.API.info("loadOldEntry show");
        rows.push(mainTableView.createRowForLoadOldEntry(storedTo));
      }
      Ti.App.Properties.setBool("stateMainTableSlide", false);
      return mainTable.setData(rows);
    });
    return true;
  };
  return getFeedByTagCommand;
})();
module.exports = getFeedByTagCommand;