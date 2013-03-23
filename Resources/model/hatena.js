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
          var iconImage, json, switchFlg;
          if (e.success) {
            json = JSON.parse(e.result.text);
            iconImage = Ti.UI.createImageView({
              width: 40,
              height: 40,
              top: 5,
              left: 5,
              image: json.profile_image_url
            });
            switchFlg = true;
            return configMenu.changeHatenaRowElement(iconImage, switchFlg);
          } else {

          }
        });
      } else {

      }
    });
    this.hatena.authorize();
    return true;
  };

  Hatena.prototype.postBookmark = function(url) {
    var xml;
    xml = "<entry xmlns='http://purl.org/atom/ns#'>\n  <title>dummy</title>\n  <link rel='related' type='text/html' href='" + url + "' />\n</entry>";
    return this.hatena.request('http://b.hatena.ne.jp/atom/post', xml, {
      'Content-Type': 'application/x.atom+xml'
    }, "POST", function(e) {
      if (e.success) {
        return alert("はてなブックマークへの投稿完了しました");
      }
    });
  };

  return Hatena;

})();

module.exports = Hatena;
