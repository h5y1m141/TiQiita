var Twitter;

Twitter = (function() {

  function Twitter() {
    var config, configJSON, file;
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/twitter.json');
    file = configJSON.read().toString();
    config = JSON.parse(file);
    this.twitter = require('lib/twitter').Twitter({
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      accessTokenKey: Ti.App.Properties.getString('twitterAccessTokenKey', ''),
      accessTokenSecret: Ti.App.Properties.getString('twitterAccessTokenSecret', ''),
      scope: 'read_public,write_public'
    });
  }

  Twitter.prototype.login = function() {
    var _this = this;
    this.twitter.addEventListener("login", function(e) {
      if (e.success) {
        Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
        Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
        return _this.twitter.request("1.1/account/verify_credentials.json", {}, {}, "GET", function(e) {
          var json, profileImageURL, switchFlg;
          if (e.success) {
            json = JSON.parse(e.result.text);
            profileImageURL = json.profile_image_url;
            Ti.API.info(profileImageURL);
            Ti.App.Properties.setString("twitterProfileImageURL", profileImageURL);
            return MenuTable.refreshMenu();
          } else {
            return switchFlg = false;
          }
        });
      } else {

      }
    });
    this.twitter.authorize();
    return true;
  };

  Twitter.prototype.postTweet = function(url, contents, title, callback) {
    var alertDialog, bitlyURLLength, postContents, postTitle, tweetLimitLength, twitterAccessTokenKey, _len,
      _this = this;
    twitterAccessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey');
    bitlyURLLength = 21;
    tweetLimitLength = 140;
    _len = contents.length + title.length;
    if (_len > tweetLimitLength - bitlyURLLength) {
      postTitle = title.substring(0, 10) + '..';
      postContents = contents.substring(0, 100);
    } else {
      postTitle = title;
      postContents = contents;
    }
    if ((twitterAccessTokenKey != null) === true) {
      return this.shortenURL(url, function(result) {
        var headers, params;
        if (result.status_txt) {
          Ti.API.info(title.length);
          params = {
            status: "「" + postTitle + "」" + result.data.url + "\n" + postContents
          };
          headers = {};
          return _this.twitter.request('https://api.twitter.com/1.1/statuses/update.json', params, headers, "POST", function(result) {
            Ti.API.info("postTweet done result is " + result);
            return callback(result);
          });
        } else {
          params = {
            status: "「" + postTitle + "」 " + postContents + " " + url
          };
          headers = {};
          return _this.twitter.request('https://api.twitter.com/1.1/statuses/update.json', params, headers, "POST", function(result) {
            Ti.API.info("postTweet done result is " + result);
            return callback(result);
          });
        }
      });
    } else {
      alertDialog = Ti.UI.createAlertDialog();
      alertDialog.setTitle("Twitterアカウント認証に失敗してるようです。\nこのアプリの設定画面のアカウントの設定を念のためご確認ください");
      return alertDialog.show();
    }
  };

  Twitter.prototype.shortenURL = function(url, callback) {
    var Config, apiKey, baseURL, config, login, longUrl, path, xhr;
    xhr = Ti.Network.createHTTPClient();
    baseURL = "http://api.bit.ly/v3/shorten?";
    login = "h5y1m141";
    longUrl = url;
    Config = require("model/loadConfig");
    config = new Config();
    apiKey = config.getbitlyAPIKey();
    path = "" + baseURL + "login=" + login + "&longUrl=" + longUrl + "&apiKey=" + apiKey;
    Ti.API.info(path);
    xhr.open('GET', path);
    xhr.onload = function() {
      var body;
      body = JSON.parse(this.responseText);
      if (this.status === 200) {
        Ti.API.info(body);
        return callback(body);
      }
    };
    xhr.onerror = function(e) {
      return Ti.API.info("bitly shorten fail");
    };
    return xhr.send();
  };

  return Twitter;

})();

module.exports = Twitter;
