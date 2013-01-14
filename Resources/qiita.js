var Qiita;
Qiita = (function() {
  function Qiita() {
    var configJSON, file;
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/login.json');
    file = configJSON.read().toString();
    this.config = JSON.parse(file);
    this.user_name = this.config.url_name;
    this.parameter = {
      stocks: {
        url: "https://qiita.com/api/v1/users/" + this.user_name + "/stocks",
        method: 'GET'
      },
      myStocks: {
        url: "https://qiita.com/api/v1/stocks",
        method: 'GET'
      },
      feed: {
        url: "https://qiita.com/api/v1/items",
        method: 'GET'
      },
      followingUsers: {
        url: "https://qiita.com/api/v1/users/" + this.user_name + "/following_users",
        method: 'GET'
      },
      followingTags: {
        url: "https://qiita.com/api/v1/users/" + this.user_name + "/following_tags",
        method: 'GET'
      }
    };
  }
  Qiita.prototype._auth = function(param) {
    var requestParam, xhr;
    if (param === null) {
      requestParam = {
        url_name: this.config.user_name,
        password: this.config.password
      };
    } else {
      requestParam = param;
    }
    xhr = Ti.Network.createHTTPClient();
    xhr.open('POST', 'https://qiita.com/api/v1/auth');
    xhr.onload = function() {
      var body;
      body = JSON.parse(xhr.responseText);
      return Ti.App.Properties.setString('QiitaToken', body.token);
    };
    xhr.onerror = function(e) {
      var error;
      error = JSON.parse(e);
      if (error.type === "error") {
        return Ti.App.Properties.setString('QiitaTokenFail', error.error);
      }
    };
    xhr.send(requestParam);
    return true;
  };
  Qiita.prototype._mockObject = function(value, storedStocksFlag, callback) {
    var followingTags, followingTagsJSON, items, itemsJSON, relLink, relLinkJSON, stocksJSON;
    followingTagsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/following_tags.json");
    itemsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/items.json");
    relLinkJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/relLink.json");
    stocksJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/stock.json");
    followingTags = JSON.parse(followingTagsJSON.read().toString());
    items = JSON.parse(itemsJSON.read().toString());
    relLink = JSON.parse(relLinkJSON.read().toString());
    if (storedStocksFlag === true) {
      this._storedStocks(itemsJSON.read().toString());
    }
    if (value === "items") {
      callback(items, relLink);
    } else if (value === "stocks") {
      callback(items, relLink);
    } else {
      callback(followingTags, relLink);
    }
    return true;
  };
  Qiita.prototype._storedStocks = function(TiAppPropertiesName, strItems) {
    var merge, result, stocks;
    stocks = JSON.parse(Ti.App.Properties.getString(TiAppPropertiesName));
    if (stocks === null) {
      Ti.App.Properties.setString(TiAppPropertiesName, strItems);
    } else {
      merge = stocks.concat(JSON.parse(strItems));
      Ti.App.Properties.setString(TiAppPropertiesName, JSON.stringify(merge));
    }
    result = JSON.parse(Ti.App.Properties.getString(TiAppPropertiesName));
    Ti.API.info("stored under " + TiAppPropertiesName + ". result is : " + result.length);
    return true;
  };
  Qiita.prototype._request = function(parameter, value, callback) {
    var self, xhr;
    self = this;
    xhr = Ti.Network.createHTTPClient();
    Ti.API.info(parameter.method + ":" + parameter.url);
    xhr.open(parameter.method, parameter.url);
    xhr.onload = function() {
      var json, relLink, responseHeaders;
      responseHeaders = xhr.responseHeaders;
      if (responseHeaders.Link) {
        relLink = self._convertLinkHeaderToJSON(responseHeaders.Link);
      } else {
        relLink = null;
      }
      json = JSON.parse(xhr.responseText);
      if (json === null) {
        self._isLastItems(true);
      } else {
        self._isLastItems(false);
      }
      Ti.API.info("ITEM COUNT : " + json.length);
      if (value !== false) {
        self._storedStocks(value, xhr.responseText);
      }
      return callback(json, relLink);
    };
    return xhr.send();
  };
  Qiita.prototype._convertLinkHeaderToJSON = function(value) {
    var i, json, length, links, relValues, _obj;
    json = [];
    links = value.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g);
    relValues = value.match(/first|prev|next|last/g);
    length = links.length - 1;
    for (i = 0; 0 <= length ? i <= length : i >= length; 0 <= length ? i++ : i--) {
      _obj = {
        "rel": relValues[i],
        "url": links[i]
      };
      json.push(_obj);
    }
    return json;
  };
  Qiita.prototype._mergeItems = function(object1, object2) {
    var _;
    _ = require("lib/underscore-1.4.3.min");
    object1 = object1.concat(object2);
    return _(object1).sortBy("created_at");
  };
  Qiita.prototype._isLastItems = function(flg) {
    Ti.API.info("start isLastItems. flg is " + flg);
    return Ti.App.properties.setBool("isLastPage", flg);
  };
  Qiita.prototype.isConnected = function() {
    return Ti.Network.online;
  };
  Qiita.prototype.getStocks = function(callback) {
    var param;
    param = this.parameter.stocks;
    return this._request(param, 'storedStocks', callback);
  };
  Qiita.prototype.getFollowingUsers = function(callback) {
    var param;
    param = this.parameter.followingUsers;
    return this._request(param, false, callback);
  };
  Qiita.prototype.getFollowingTags = function(callback) {
    var param;
    param = this.parameter.followingTags;
    return this._request(param, false, callback);
  };
  Qiita.prototype.getFeed = function(callback) {
    var param;
    param = this.parameter.feed;
    return this._request(param, 'storedStocks', callback);
  };
  Qiita.prototype.getNextFeed = function(url, storedTo, callback) {
    var param;
    param = {
      "url": url,
      "method": 'GET'
    };
    return this._request(param, storedTo, callback);
  };
  Qiita.prototype.getMyStocks = function(callback) {
    var param, token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      this._auth();
    }
    Ti.API.info("token is : " + (Ti.App.Properties.getString('QiitaToken')));
    param = {
      url: this.parameter.myStocks.url + ("?token=" + token),
      method: this.parameter.myStocks.method
    };
    return this._request(param, 'storedMyStocks', callback);
  };
  Qiita.prototype.getMyFeed = function(callback) {
    var param, token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      this._auth();
    }
    param = {
      url: this.parameter.myFeed.url + ("?token=" + token),
      method: this.parameter.myFeed.method
    };
    return this._request(param, false, callback);
  };
  Qiita.prototype.putStock = function(uuid) {
    var method, token, url, xhr;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      this._auth();
    }
    xhr = Ti.Network.createHTTPClient();
    method = 'PUT';
    xhr.setRequestHeader('X-HTTP-Method-Override', method);
    url = "https://qiita.com/api/v1/items/" + uuid + "/stock";
    xhr.open(method, url);
    xhr.send({
      token: Ti.App.Properties.getString('QiitaToken')
    });
    return xhr.onload = function() {
      var alertDialog, body;
      body = JSON.parse(xhr.responseText);
      actInd.hide();
      alertDialog = Ti.UI.createAlertDialog();
      alertDialog.setTitle("Qiitaへのストックが完了しました");
      return alertDialog.show();
    };
  };
  return Qiita;
})();
module.exports = Qiita;