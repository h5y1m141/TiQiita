var getFeedByTagCommand;
getFeedByTagCommand = (function() {
  function getFeedByTagCommand(followinTagsName, tagName) {
    this.followinTagsName = followinTagsName;
    this.tagName = tagName;
  }
  getFeedByTagCommand.prototype.execute = function() {
    var items, json, result, showFlg, storedTo, _i, _len;
    storedTo = "followinTags" + this.tagName;
    items = JSON.parse(Ti.App.Properties.getString(storedTo));
    result = [];
    Ti.API.info("getFeedByTagCommand!  items is " + items);
    if (items !== null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(t.createRow(json));
      }
      result.push(t.createRowForLoadOldEntry(storedTo));
    } else {
      showFlg = true;
      this.getFeedByTag(showFlg);
    }
    return mainTable.setData(result);
  };
  getFeedByTagCommand.prototype.getFeedByTag = function(showFlg) {
    var MAXITEMCOUNT, rows, storedTo;
    rows = [];
    MAXITEMCOUNT = 20;
    storedTo = "followinTags" + this.tagName;
    return qiita.getFeedByTag(this.tagName, function(result, links) {
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
        label: storedTo,
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
        rows.push(t.createRowForLoadOldEntry(storedTo));
      }
      if (showFlg === true) {
        return mainTable.setData(rows);
      } else {
        return null;
      }
    });
  };
  return getFeedByTagCommand;
})();
module.exports = getFeedByTagCommand;