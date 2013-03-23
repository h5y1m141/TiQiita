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


            switchFlg = true

            configMenu.changeHatenaRowElement(iconImage,switchFlg)  
            
          else


      else

    

    @hatena.authorize()


    return true

  postBookmark:(url) ->
      
    xml = """
    <entry xmlns='http://purl.org/atom/ns#'>
      <title>dummy</title>
      <link rel='related' type='text/html' href='#{url}' />
    </entry>
    """

    param =
      oauth_token:Ti.App.Properties.getString('hatenaAccessTokenKey')
      oauth_token_secret: Ti.App.Properties.getString('hatenaAccessTokenSecret')
      xmlData: xml


    _xhr = Ti.Network.createHTTPClient()
    _xhr.open 'POST', 'http://b.hatena.ne.jp/atom/post'
    _xhr.setRequestHeader("Content-type","application/x.atom+xml")



    _xhr.onload = (e) ->
      Ti.API.info "hatena status code: #{@.status}"
      
    _xhr.onerror = (e) ->
      dialog = Ti.UI.createAlertDialog
        title: "Ouch!"
        message: "StatusCode: #{@.status}"
      dialog.show()
    _xhr.send xml



module.exports = Hatena