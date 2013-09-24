class Twitter
  constructor: () ->
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/twitter.json')
    file = configJSON.read().toString();
    config = JSON.parse(file);

    @twitter = require('lib/twitter').Twitter(
      consumerKey: config.consumerKey
      consumerSecret: config.consumerSecret
      accessTokenKey: Ti.App.Properties.getString('twitterAccessTokenKey', '')
      accessTokenSecret: Ti.App.Properties.getString('twitterAccessTokenSecret', '')
      scope: 'read_public,write_public'
    )


  login:() ->

    @twitter.addEventListener "login", (e) =>
      if e.success
        Ti.App.Properties.setString 'twitterAccessTokenKey', e.accessTokenKey
        Ti.App.Properties.setString 'twitterAccessTokenSecret', e.accessTokenSecret
        @twitter.request "1.1/account/verify_credentials.json", {}, {}, "GET", (e) ->
          if e.success
            json = JSON.parse(e.result.text)

            profileImageURL = json.profile_image_url
            Ti.API.info profileImageURL
            Ti.App.Properties.setString "twitterProfileImageURL", profileImageURL
            MenuTable.refreshMenu()
            
          else
            switchFlg = false



      else

    

    @twitter.authorize()


    return true

  postTweet:(url,contents,callback) ->
      
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
      alertDialog.setTitle "Twitterアカウント認証に失敗してるようです。\nこのアプリの設定画面のアカウントの設定を念のためご確認ください"
      alertDialog.show()
      


module.exports = Twitter
