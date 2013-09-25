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

  Twitter.prototype.postTweet = function(url, contents, callback) {
    var alertDialog, headers, params, twitterAccessTokenKey;
    twitterAccessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey');
    if ((twitterAccessTokenKey != null) === true) {
      params = {
        status: contents + " " + url
      };
      headers = {};
      return this.twitter.request('https://api.twitter.com/1.1/statuses/update.json', params, headers, "POST", function(result) {
        Ti.API.info("postTweet done result is " + result);
        return callback(result);
      });
    } else {
      alertDialog = Ti.UI.createAlertDialog();
      alertDialog.setTitle("Twitterアカウント認証に失敗してるようです。\nこのアプリの設定画面のアカウントの設定を念のためご確認ください");
      return alertDialog.show();
    }
  };

  return Twitter;

})();

module.exports = Twitter;
