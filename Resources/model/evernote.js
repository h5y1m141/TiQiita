var Evernote;

Evernote = (function() {

  function Evernote() {
    var config, configJSON, file;
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/evernote.json');
    file = configJSON.read().toString();
    config = JSON.parse(file);
    this.evernote = require('lib/hatena').Hatena({
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      accessTokenKey: Ti.App.Properties.getString('evernoteAccessTokenKey', ''),
      accessTokenSecret: Ti.App.Properties.getString('evernoteAccessTokenSecret', ''),
      scope: 'read_public,write_public'
    });
  }

  Evernote.prototype.login = function() {
    return true;
  };

  return Evernote;

})();

module.exports = Evernote;
