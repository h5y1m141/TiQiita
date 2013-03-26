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
            
          else
            switchFlg = false
            configMenu.changeHatenaRowElement(switchFlg)  


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
    
    @hatena.request('http://b.hatena.ne.jp/atom/post', xml, {'Content-Type':'application/x.atom+xml'}, "POST", (e) ->
      if e.success
        alertDialog = Ti.UI.createAlertDialog()
        alertDialog.setTitle "はてなブックマークへの投稿完了しました"
        alertDialog.show()

    )


module.exports = Hatena