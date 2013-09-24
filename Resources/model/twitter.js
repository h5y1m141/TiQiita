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
    var alertDialog, hatenaAccessTokenKey, xml;
    Ti.API.info("hanate postBookmark start. url is " + url + " and contents is " + contents);
    xml = "<entry xmlns='http://purl.org/atom/ns#'>\n  <title>dummy</title>\n  <link rel='related' type='text/html' href='" + url + "' />\n  <summary type='text/plain'>" + contents + "</summary>        \n</entry>";
    hatenaAccessTokenKey = Ti.App.Properties.getString("hatenaAccessTokenKey");
    if ((hatenaAccessTokenKey != null) === true) {
      return this.hatena.request('http://b.hatena.ne.jp/atom/post', xml, {
        'Content-Type': 'application/x.atom+xml'
      }, "POST", function(result) {
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
