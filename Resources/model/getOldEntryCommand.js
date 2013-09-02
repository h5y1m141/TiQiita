var getOldEntryCommand,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

getOldEntryCommand = (function(_super) {

  __extends(getOldEntryCommand, _super);

  function getOldEntryCommand() {
    this.value = 'storedStocks';
    this.direction = "vertical";
  }

  getOldEntryCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    if (this._currentSlideState() === "default") {
      this._showStatusView();
    }
    items = JSON.parse(Ti.App.Properties.getString(this.value));
    if (items !== null) {
      if (this._currentSlideState() === "default") {
        this._showStatusView();
      } else {
        this._hideStatusView();
      }
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

  getOldEntryCommand.prototype.loadOldEntry = function(storedTo) {
    var MAXITEMCOUNT, currentPage, nextURL,
      _this = this;
    MAXITEMCOUNT = 20;
    this._hideStatusView();
    currentPage = Ti.App.Properties.getString("currentPage");
    nextURL = Ti.App.Properties.getString("" + currentPage + "nextURL");
    if (nextURL !== null) {
      qiita.getNextFeed(nextURL, storedTo, function(result) {
        var json, lastIndex, r, _i, _len, _results;
        Ti.API.info("getNextFeed start. result is " + result.length);
        _this._hideStatusView();
        if (result.length !== MAXITEMCOUNT) {
          return mainTableView.hideLastRow();
        } else {
          _results = [];
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            json = result[_i];
            r = mainTableView.createRow(json);
            lastIndex = mainTableView.lastRowIndex();
            _results.push(mainTableView.insertRow(lastIndex, r));
          }
          return _results;
        }
      });
    }
    return true;
  };

  getOldEntryCommand.prototype._currentSlideState = function() {
    return getOldEntryCommand.__super__._currentSlideState.call(this);
  };

  getOldEntryCommand.prototype._showStatusView = function() {
    return getOldEntryCommand.__super__._showStatusView.call(this);
  };

  getOldEntryCommand.prototype._hideStatusView = function() {
    return getOldEntryCommand.__super__._hideStatusView.call(this);
  };

  return getOldEntryCommand;

})(baseCommand);

module.exports = getOldEntryCommand;
