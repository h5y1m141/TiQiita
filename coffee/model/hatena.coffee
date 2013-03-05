class Hatena
  constructor: () ->
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/hatena.json')
    file = configJSON.read().toString();
    config = JSON.parse(file);

    @hatena = require('lib/hatena').Hatena(
      consumerKey: config.consumerKey
      consumerSecret: config.consumerSecret
      accessTokenKey: Ti.App.Properties.getString('hatenaAccessTokenKey', '')
      accessTokenSecret: Ti.App.Properties.getString('hatenaAccessTokenSecret', '')
      scope: 'read_public,write_public'
    )


  login:() ->
    hatenaAuthorize = (event) ->
      @hatena.addEventListener "login", (e) ->
        if e.success
          Ti.App.Properties.setString "hatenaAccessTokenKey", e.accessTokenKey
          Ti.App.Properties.setString "hatenaAccessTokenSecret", e.accessTokenSecret
          @hatena.request "applications/my.json", {}, {}, "POST", (e) ->
            if e.success
              json = JSON.parse(e.result.text)
            else

        
        # error proc...
        else

      
      # error proc…
      @hatena.authorize()

    if @hatena.authorized
      hatenaAuthorize()
    else

    return true

module.exports = Hatena