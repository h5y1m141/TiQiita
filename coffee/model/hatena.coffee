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

  postBookmark:(url,contents,callback) ->
      
    Ti.API.info "hanate postBookmark start. url is #{url} and contents is #{contents}"
    xml = """
    <entry xmlns='http://purl.org/atom/ns#'>
      <title>dummy</title>
      <link rel='related' type='text/html' href='#{url}' />
      <summary type='text/plain'>#{contents}</summary>        
    </entry>
    """
    # 念のためaccesstokenの存在を確認した上でポスト処理する
    hatenaAccessTokenKey  = Ti.App.Properties.getString("hatenaAccessTokenKey")

    if hatenaAccessTokenKey? is true
      
      @hatena.request('http://b.hatena.ne.jp/atom/post', xml, {'Content-Type':'application/x.atom+xml'}, "POST", (result) ->
        return callback(result)

      )
    else
      alertDialog = Ti.UI.createAlertDialog()
      alertDialog.setTitle "はてなのアカウント認証に失敗してるようです。\nこのアプリの設定画面のはてなのアカウントの設定を念のためご確認ください"
      alertDialog.show()
      


module.exports = Hatena