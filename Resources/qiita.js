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

  Qiita.prototype._auth = function() {
    var param, xhr;
    xhr = Ti.Network.createHTTPClient();
    param = {
      url_name: this.config.user_name,
      password: this.config.password
    };
    xhr.open('POST', 'https://qiita.com/api/v1/auth');
    xhr.onload = function() {
      var body;
      body = JSON.parse(xhr.responseText);
      return Ti.App.Properties.setString('QiitaToken', body.token);
    };
    xhr.send(param);
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

  Qiita.prototype._storedMyStocks = function(strItems) {
    var mergeMyStocks, myStocks, myStocksresult, objmyStocks1, objmyStocks2;
    myStocks = JSON.parse(Ti.App.Properties.getString('storedMyStocks'));
    if (myStocks === null) {
      Ti.App.Properties.setString('storedMyStocks', strItems);
    } else {
      objmyStocks1 = strItems.substring(0, strItems.length - 1);
      myStocks = Ti.App.Properties.getString('storedMyStocks');
      objmyStocks2 = myStocks.substring(1, myStocks.length);
      mergeMyStocks = "" + objmyStocks1 + "," + objmyStocks2;
      Ti.App.Properties.setString('storedMyStocks', mergeMyStocks);
    }
    myStocksresult = JSON.parse(Ti.App.Properties.getString('storedMyStocks'));
    Ti.API.info("_storedMyStocks finish. result is : " + myStocksresult.length);
    return true;
  };

  Qiita.prototype._storedStocks = function(strItems) {
    var merge, obj1, obj2, result, stocks;
    stocks = JSON.parse(Ti.App.Properties.getString('storedStocks'));
    if (stocks === null) {
      Ti.App.Properties.setString('storedStocks', strItems);
    } else {
      obj1 = strItems.substring(0, strItems.length - 1);
      stocks = Ti.App.Properties.getString('storedStocks');
      obj2 = stocks.substring(1, stocks.length);
      merge = "" + obj1 + "," + obj2;
      Ti.App.Properties.setString('storedStocks', merge);
    }
    result = JSON.parse(Ti.App.Properties.getString('storedStocks'));
    Ti.API.info("_storedStocks finish. result is : " + result.length);
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
      Ti.API.info("_request method start");
      responseHeaders = xhr.responseHeaders;
      Ti.API.info(responseHeaders);
      if (responseHeaders.Link) {
        relLink = self._convertLinkHeaderToJSON(responseHeaders.Link);
      } else {
        relLink = null;
      }
      json = JSON.parse(xhr.responseText);
      if (value === "MyStock") {
        Ti.API.info("My Stock selected");
        self._storedMyStocks(xhr.responseText);
      } else if (value === "stock") {
        Ti.API.info("Stock selected!!");
        self._storedStocks(xhr.responseText);
      } else {

      }
      return callback(json, relLink);
    };
    return xhr.send();
  };

  Qiita.prototype._convertLinkHeaderToJSON = function(value) {
    var i, json, length, links, relValues, _i, _obj;
    json = [];
    links = value.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g);
    relValues = value.match(/first|prev|next|last/g);
    length = links.length - 1;
    for (i = _i = 0; 0 <= length ? _i <= length : _i >= length; i = 0 <= length ? ++_i : --_i) {
      _obj = {
        "rel": relValues[i],
        "url": links[i]
      };
      json.push(_obj);
    }
    return json;
  };

  Qiita.prototype.getStocks = function(callback) {
    var param;
    param = this.parameter.stocks;
    return this._request(param, "stock", callback);
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
    return this._request(param, "stock", callback);
  };

  Qiita.prototype.getNextFeed = function(url, callback) {
    var param;
    param = {
      "url": url,
      "method": 'GET'
    };
    return this._request(param, "stock", callback);
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
    return this._request(param, "MyStock", callback);
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
    Ti.API.info(param.url);
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
