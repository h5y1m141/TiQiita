var Hatena;

Hatena = (function() {

  function Hatena() {
    var config, configJSON, file;
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/hatena.json');
    file = configJSON.read().toString();
    config = JSON.parse(file);
    this.hatena = require('lib/hatena').Hatena({
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      accessTokenKey: Ti.App.Properties.getString('hatenaAccessTokenKey', ''),
      accessTokenSecret: Ti.App.Properties.getString('hatenaAccessTokenSecret', ''),
      scope: 'read_public,write_public'
    });
  }

  Hatena.prototype.login = function() {
    var _this = this;
    this.hatena.addEventListener("login", function(e) {
      if (e.success) {
        Ti.App.Properties.setString("hatenaAccessTokenKey", e.accessTokenKey);
        Ti.App.Properties.setString("hatenaAccessTokenSecret", e.accessTokenSecret);
        return _this.hatena.request("applications/my.json", {}, {}, "POST", function(e) {
          var json, switchFlg;
          if (e.success) {
            json = JSON.parse(e.result.text);
            Ti.App.Properties.setString("hatenaProfileImageURL", json.profile_image_url);
            return MenuTable.refreshMenu();
          } else {
            return switchFlg = false;
          }
        });
      } else {

      }
    });
    this.hatena.authorize();
    return true;
  };

  Hatena.prototype.postBookmark = function(url, contents, callback) {
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
      alertDialog.setTitle("はてなのアカウント認証に失敗してるようです。\nこのアプリの設定画面のはてなのアカウントの設定を念のためご確認ください");
      return alertDialog.show();
    }
  };

  return Hatena;

})();

module.exports = Hatena;
