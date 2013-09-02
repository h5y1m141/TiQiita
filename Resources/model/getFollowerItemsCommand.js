var getFollowerItemsCommand,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

getFollowerItemsCommand = (function(_super) {

  __extends(getFollowerItemsCommand, _super);

  function getFollowerItemsCommand() {}

  getFollowerItemsCommand.prototype.execute = function() {
    var items, json, result, _i, _len;
    result = [];
    items = JSON.parse(Ti.App.Properties.getString("followerItems"));
    if ((items != null) === false || items === "") {
      return this.getFollowerItems();
    } else {
      items.sort(function(a, b) {
        if (moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm")) {
          return -1;
        } else {
          return 1;
        }
      });
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        json = items[_i];
        result.push(mainTableView.createRow(json));
      }
      mainTable.setData(result);
      return this._hideStatusView();
    }
  };

  getFollowerItemsCommand.prototype.getFollowerItems = function() {
    var _this = this;
    this._showStatusView();
    return qiitaUser.getfollowingUserList(function(userList) {
      var item, xhr, _i, _items, _len, _url;
      for (_i = 0, _len = userList.length; _i < _len; _i++) {
        item = userList[_i];
        _url = "https://qiita.com/api/v1/users/" + item.url_name + "/items?per_page=20";
        _items = [];
        xhr = Ti.Network.createHTTPClient();
        xhr.open("GET", _url);
        xhr.onload = function() {
          var items, _j, _len1, _results;
          if (this.status === 200) {
            items = JSON.parse(this.responseText);
            if (items !== null) {
              _results = [];
              for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                item = items[_j];
                _results.push(_items.push(item));
              }
              return _results;
            }
          }
        };
        xhr.onerror = function(e) {
          var error;
          error = JSON.parse(this.responseText);
          return Ti.API.info(error);
        };
        xhr.timeout = 5000;
        xhr.send();
      }
      return setTimeout((function() {
        var result, _item, _j, _len1;
        result = [];
        _items.sort(function(a, b) {
          if (moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm")) {
            return -1;
          } else {
            return 1;
          }
        });
        Ti.App.Properties.setString("followerItems", JSON.stringify(_items));
        for (_j = 0, _len1 = _items.length; _j < _len1; _j++) {
          _item = _items[_j];
          result.push(mainTableView.createRow(_item));
        }
        mainTable.setData(result);
        return _this._hideStatusView();
      }), 10000);
    });
  };

  getFollowerItemsCommand.prototype._currentSlideState = function() {
    return getFollowerItemsCommand.__super__._currentSlideState.call(this);
  };

  getFollowerItemsCommand.prototype._showStatusView = function() {
    return getFollowerItemsCommand.__super__._showStatusView.call(this);
  };

  getFollowerItemsCommand.prototype._hideStatusView = function() {
    return getFollowerItemsCommand.__super__._hideStatusView.call(this);
  };

  return getFollowerItemsCommand;

})(baseCommand);

module.exports = getFollowerItemsCommand;
