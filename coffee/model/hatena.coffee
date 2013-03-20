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

    @hatena.addEventListener "login", (e) =>
      if e.success
        Ti.App.Properties.setString "hatenaAccessTokenKey", e.accessTokenKey
        Ti.App.Properties.setString "hatenaAccessTokenSecret", e.accessTokenSecret
        @hatena.request "applications/my.json", {}, {}, "POST", (e) ->
          if e.success
            json = JSON.parse(e.result.text)
            iconImage = Ti.UI.createImageView
              width:40
              height:40
              top:5
              left:5
              image:json.profile_image_url
              
            Ti.API.info json.profile_image_url
            switchFlg = true

            configMenu.changeHatenaRowElement(iconImage,switchFlg)  
            
          else


      else

    

    @hatena.authorize()


    return true

module.exports = Hatena