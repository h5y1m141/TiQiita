var qiitaUser;

qiitaUser = (function() {

  function qiitaUser(url_name) {
    if ((url_name != null) === false) {
      this.url_name = Ti.App.Properties.getString('QiitaLoginID');
    } else {
      this.url_name = url_name;
    }
  }

  qiitaUser.prototype.getfollowingUserList = function(callback) {
    var param;
    param = {
      method: 'GET',
      url: "https://qiita.com/api/v1/users/" + this.url_name + "/following_users"
    };
    return this._request(param, callback);
  };

  qiitaUser.prototype.getUserInfo = function(callback) {
    var param;
    param = {
      method: 'GET',
      url: "https://qiita.com/api/v1/users/" + this.url_name
    };
    return this._request(param, callback);
  };

  qiitaUser.prototype._request = function(param, callback) {
    var self, xhr;
    self = this;
    xhr = Ti.Network.createHTTPClient();
    xhr.open(param.method, param.url);
    xhr.onload = function() {
      var json;
      if (this.status === 200) {
        json = JSON.parse(this.responseText);
        self._cached(this.responseText);
        return callback(json);
      }
    };
    xhr.onerror = function(e) {
      var error;
      error = JSON.parse(this.responseText);
      return Ti.API.info("status code: " + this.status + " and Error:" + error.error);
    };
    xhr.timeout = 5000;
    xhr.send();
  };

  qiitaUser.prototype._cached = function(userInfo) {
    Titanium.App.Properties.setString("qiitaUserList", userInfo);
    return true;
  };

  return qiitaUser;

})();

module.exports = qiitaUser;
