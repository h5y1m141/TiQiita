var Qiita,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Qiita = (function() {

  function Qiita() {
    this.getMyStocks = __bind(this.getMyStocks, this);

    var QiitaLoginID, configJSON, file;
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/login.json');
    file = configJSON.read().toString();
    this.config = JSON.parse(file);
    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');
    if (QiitaLoginID === null) {
      this.user_name = this.config.url_name;
    } else {
      this.user_name = QiitaLoginID;
    }
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
      followingTags: {
        url: "https://qiita.com/api/v1/users/" + this.user_name + "/following_tags?per_page=100",
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
    Ti.API.info("qiita._auth requestParam url_name is " + requestParam.url_name);
    xhr = Ti.Network.createHTTPClient();
    xhr.open('POST', 'https://qiita.com/api/v1/auth');
    xhr.onload = function() {
      var body, token;
      body = JSON.parse(this.responseText);
      Ti.API.info("status code: " + this.status);
      if (this.status === 200) {
        Ti.App.Properties.setString('QiitaToken', body.token);
        token = body.token;
      } else {
        token = null;
      }
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

  Qiita.prototype._storedStocks = function(_storedTo, strItems) {
    var cachedItems, length, merge, result, stocks;
    cachedItems = Ti.App.Properties.getString(_storedTo);
    stocks = JSON.parse(cachedItems);
    if (stocks !== null) {
      Ti.API.info(stocks.length);
    }
    if (stocks === null) {
      length = JSON.parse(strItems);
      Ti.API.info("_storedStocks start");
      Ti.App.Properties.setString(_storedTo, strItems);
    } else {
      Ti.API.info("_storedStocks merge start");
      merge = stocks.concat(JSON.parse(strItems));
      Ti.App.Properties.setString(_storedTo, JSON.stringify(merge));
    }
    result = JSON.parse(Ti.App.Properties.getString(_storedTo));
    return Ti.API.info("_storedStocks finish : " + result.length);
  };

  Qiita.prototype._request = function(parameter, storedTo, callback) {
    var self, xhr;
    self = this;
    xhr = Ti.Network.createHTTPClient();
    xhr.ondatastream = function(e) {
      if (storedTo === "followingTags") {
        return Ti.API.debug("フォローしてるタグの情報取得する際には何も行わない");
      } else {
        if (Math.round(e.progress * 100) <= 100) {
          Ti.API.info("xhr.ondatastream start progress is " + (Math.round(e.progress * 100)));
          return progressBar.value = e.progress;
        }
      }
    };
    Ti.API.info(parameter.method + ":" + parameter.url);
    xhr.open(parameter.method, parameter.url);
    xhr.onload = function() {
      var json, relLink, responseHeaders;
      json = JSON.parse(this.responseText);
      if (storedTo === "followingTags") {
        Ti.API.debug("フォローしてるタグの情報取得する際には何も行わない");
      } else {
        Ti.API.info("start _storedStocks " + storedTo);
        self._storedStocks(storedTo, this.responseText);
        responseHeaders = this.responseHeaders;
        if (responseHeaders.Link) {
          relLink = self._convertLinkHeaderToJSON(responseHeaders.Link);
          self._parsedResponseHeader(relLink, storedTo);
        } else {
          relLink = null;
        }
      }
      return callback(json, relLink);
    };
    xhr.onerror = function(e) {
      var error;
      error = JSON.parse(this.responseText);
      return Ti.API.debug("_request method error." + error.error);
    };
    xhr.timeout = 5000;
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

  Qiita.prototype._parsedResponseHeader = function(header, storedTo) {
    var lastURL, link, nextURL, _i, _len;
    for (_i = 0, _len = header.length; _i < _len; _i++) {
      link = header[_i];
      if (link["rel"] === 'next') {
        nextURL = link["url"];
      } else if (link["rel"] === 'last') {
        lastURL = link["url"];
      } else {
        Ti.API.info("done");
      }
    }
    if (storedTo !== "followingTags") {
      Ti.App.Properties.setString("" + storedTo + "nextURL", nextURL);
    }
    return true;
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
    param = {
      url: "https://qiita.com/api/v1/users/" + this.user_name + "/following_tags",
      method: 'GET'
    };
    return this._request(param, "followingTags", callback);
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
    var param, storedTo, url;
    url = "https://qiita.com/api/v1/tags/" + tagName + "/items";
    storedTo = "followingTag" + tagName;
    param = {
      "url": url,
      "method": 'GET'
    };
    return this._request(param, storedTo, callback);
  };

  Qiita.prototype.getMyStocks = function(callback) {
    var param,
      _this = this;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    return this._auth(param, function(token) {
      var requestParam;
      if (token === null) {
        alert("QiitaのユーザIDかパスワードが間違ってます");
      } else {

      }
      requestParam = {
        url: "https://qiita.com/api/v1/stocks?token=" + token,
        method: 'GET'
      };
      return _this._request(requestParam, "storedMyStocks", callback);
    });
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
    var param,
      _this = this;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    return qiita._auth(param, function(token) {
      var method, url, xhr;
      xhr = Ti.Network.createHTTPClient();
      method = 'PUT';
      url = "https://qiita.com/api/v1/items/" + uuid + "/stock";
      xhr.open(method, url);
      xhr.setRequestHeader('X-HTTP-Method-Override', method);
      xhr.onload = function() {
        var alertDialog, body;
        body = JSON.parse(xhr.responseText);
        actInd.hide();
        alertDialog = Ti.UI.createAlertDialog();
        alertDialog.setTitle("Qiitaへのストックが完了しました");
        return alertDialog.show();
      };
      xhr.onerror = function(e) {
        return {
          message: "StatusCode: " + this.status
        };
      };
      Ti.API.debug(Ti.App.Properties.getString('QiitaToken'));
      return xhr.send({
        token: Ti.App.Properties.getString('QiitaToken')
      });
    });
  };

  Qiita.prototype.setRequestParameter = function(name) {
    Ti.API.info("setRequestParameter start.user name id " + this.user_name + " and name is " + name);
    this.user_name = name;
    Ti.API.info("setRequestParameter done." + this.parameter.followingTag);
    return true;
  };

  return Qiita;

})();

module.exports = Qiita;
