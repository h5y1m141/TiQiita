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
      feedByTag: {
        url: "https://qiita.com/api/v1/tags/@{tagName}/items",
        method: 'GET'
      },
      followingUsers: {
        url: "https://qiita.com/api/v1/users/" + this.user_name + "/following_users",
        method: 'GET'
      },
      followingTags: {
        url: "https://qiita.com/api/v1/users/" + this.user_name + "/following_tags",
        method: 'GET'
      },
      tags: {
        url: "https://qiita.com/api/v1/tags",
        method: 'GET'
      }
    };
  }
  Qiita.prototype._auth = function(param, callback) {
    var requestParam, xhr;
    if (typeof param !== "undefined" && param !== null) {
      requestParam = param;
    } else if (Ti.App.Properties.getString('QiitaLoginID') !== null) {
      requestParam = {
        url_name: Ti.App.Properties.getString('QiitaLoginID'),
        password: Ti.App.Properties.getString('QiitaLoginPassword')
      };
    } else {
      requestParam = {
        url_name: this.config.url_name,
        password: this.config.password
      };
    }
    xhr = Ti.Network.createHTTPClient();
    xhr.open('POST', 'https://qiita.com/api/v1/auth');
    xhr.onload = function() {
      var body, token;
      body = JSON.parse(this.responseText);
      Ti.API.info("status code: " + this.status);
      Ti.App.Properties.setString('QiitaToken', body.token);
      token = body.token;
      return callback(token);
    };
    xhr.onerror = function(e) {
      var error, token;
      Ti.API.info("status code: " + this.status);
      Ti.App.Properties.setString('QiitaToken', null);
      error = JSON.parse(this.responseText);
      Ti.API.info(error.error);
      Ti.App.Properties.setString('QiitaTokenFail', error.error);
      token = null;
      return callback(token);
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
    var logData, self, xhr;
    self = this;
    if (self.isConnected() === false) {
      logData = {
        source: "qiita._request()",
        time: moment().format("YYYY-MM-DD hh:mm:ss"),
        message: "fail"
      };
      Ti.API.info(logData);
      controller.logging(logData);
    }
    xhr = Ti.Network.createHTTPClient();
    Ti.API.info(parameter.method + ":" + parameter.url);
    xhr.open(parameter.method, parameter.url);
    xhr.onload = function() {
      var json, link, relLink, responseHeaders, _i, _len;
      json = JSON.parse(this.responseText);
      if (value !== false) {
        self._storedStocks(value, this.responseText);
        responseHeaders = this.responseHeaders;
        if (responseHeaders.Link) {
          relLink = self._convertLinkHeaderToJSON(responseHeaders.Link);
          for (_i = 0, _len = relLink.length; _i < _len; _i++) {
            link = relLink[_i];
            if (link["rel"] === 'next') {
              Ti.API.info(link["url"]);
              Ti.App.Properties.setString('nextPageURL', link["url"]);
            } else if (link["rel"] === 'last') {
              Ti.App.Properties.setString('lastPageURL', link["url"]);
            } else {
              Ti.API.info("done");
            }
          }
        } else {
          relLink = null;
        }
      }
      return callback(json, relLink);
    };
    xhr.onerror = function(e) {
      var error;
      error = JSON.parse(e);
      return controller.errorHandle(error.error);
    };
    xhr.timeout = 5000;
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
  Qiita.prototype.getTags = function(callback) {
    var param;
    param = this.parameter.tags;
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
  Qiita.prototype.getFeedByTag = function(tagName, callback) {
    var param;
    param = this.parameter.feedByTag;
    return this._request(param, tagName, callback);
  };
  Qiita.prototype.getMyStocks = function(callback) {
    var param, token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      this._auth();
    }
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