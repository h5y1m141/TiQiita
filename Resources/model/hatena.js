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
          var json;
          if (e.success) {
            return json = JSON.parse(e.result.text);
          } else {

          }
        });
      } else {

      }
    });
    this.hatena.authorize();
    return true;
  };

  return Hatena;

})();

module.exports = Hatena;
