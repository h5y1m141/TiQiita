class Evernote
  constructor: () ->
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/evernote.json')
    file = configJSON.read().toString();
    config = JSON.parse(file);

    @evernote = require('lib/hatena').Hatena(
      consumerKey: config.consumerKey
      consumerSecret: config.consumerSecret
      accessTokenKey: Ti.App.Properties.getString('evernoteAccessTokenKey', '')
      accessTokenSecret: Ti.App.Properties.getString('evernoteAccessTokenSecret', '')
      scope: 'read_public,write_public'
    )


  login:() ->
    return true
    
module.exports = Evernote