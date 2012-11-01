var Qiita;

Qiita = (function() {

  function Qiita(name) {
    this.name = name;
    this.user_name = 'h5y1m141@github';
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
    var config, xhr;
    xhr = Ti.Network.createHTTPClient();
    config = {
      url_name: this.user_name,
      password: 'orih6254'
    };
    xhr.open('POST', 'https://qiita.com/api/v1/auth');
    xhr.onload = function() {
      var body;
      body = JSON.parse(xhr.responseText);
      return Ti.App.Properties.setString('QiitaToken', body.token);
    };
    xhr.send(config);
    return true;
  };

  Qiita.prototype._mockObject = function(value, callback) {
    var followingTags, followingTagsJSON, items, itemsJSON, relLink, relLinkJSON;
    followingTagsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/following_tags.json");
    itemsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/items.json");
    relLinkJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "test/relLink.json");
    followingTags = JSON.parse(followingTagsJSON.read().toString());
    items = JSON.parse(itemsJSON.read().toString());
    relLink = JSON.parse(relLinkJSON.read().toString());
    if (value === "items") {
      callback(items, relLink);
    } else {
      callback(followingTags, relLink);
    }
    return true;
  };

  Qiita.prototype._request = function(parameter, callback) {
    var self, xhr;
    self = this;
    xhr = Ti.Network.createHTTPClient();
    Ti.API.info(parameter.method + ":" + parameter.url);
    xhr.open(parameter.method, parameter.url);
    xhr.onload = function() {
      var json, relLink, responseHeaders;
      Ti.API.info("_request method start");
      responseHeaders = xhr.responseHeaders;
      if (responseHeaders.Link) {
        relLink = self._convertLinkHeaderToJSON(responseHeaders.Link);
      } else {
        relLink = null;
      }
      json = JSON.parse(xhr.responseText);
      Ti.API.info("start callback function");
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
    return this._request(param, callback);
  };

  Qiita.prototype.getFollowingUsers = function(callback) {
    var param;
    param = this.parameter.followingUsers;
    return this._request(param, callback);
  };

  Qiita.prototype.getFollowingTags = function(callback) {
    var param;
    param = this.parameter.followingTags;
    return this._mockObject("followingTags", callback);
  };

  Qiita.prototype.getFeed = function(callback) {
    var param;
    param = this.parameter.feed;
    return this._mockObject("items", callback);
  };

  Qiita.prototype.getNextFeed = function(url, callback) {
    var param;
    param = {
      "url": url,
      "method": 'GET'
    };
    return this._mockObject("items", callback);
  };

  Qiita.prototype.getMyStocks = function(callback) {
    var param, token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      this._auth();
    }
    param = {
      url: this.parameter.myStocks.url + ("?token=" + token),
      method: this.parameter.myStocks.url
    };
    Ti.API.info(param.url);
    return this._request(param, callback);
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
    return this._request(param, callback);
  };

  return Qiita;

})();

module.exports = Qiita;
