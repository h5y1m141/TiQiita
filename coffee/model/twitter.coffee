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

  postTweet:(url,contents,title,callback) ->

    # 念のためaccesstokenの存在を確認した上でポスト処理する
    twitterAccessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey')

    if twitterAccessTokenKey? is true
      @shortenURL(url,(result) =>
        if result.status_txt
          params =
            status:"「#{title}」 #{contents} #{result.data.url}"
            
          headers = {}
          @twitter.request('https://api.twitter.com/1.1/statuses/update.json',params,headers, "POST", (result) ->
            Ti.API.info "postTweet done result is #{result}"
            return callback(result)

          )
        else
          # bit.lyから短縮URLが取得できない場合があるかもしれないため
          # その場合には通常のURLをtweetする
          params =
            status:"「#{title}」 #{contents} #{url}"
            
          headers = {}
          @twitter.request('https://api.twitter.com/1.1/statuses/update.json',params,headers, "POST", (result) ->
            Ti.API.info "postTweet done result is #{result}"
            return callback(result)
          
          
      )

    else
      alertDialog = Ti.UI.createAlertDialog()
      alertDialog.setTitle "Twitterアカウント認証に失敗してるようです。\nこのアプリの設定画面のアカウントの設定を念のためご確認ください"
      alertDialog.show()
      
  shortenURL:(url,callback) ->
    xhr = Ti.Network.createHTTPClient()
    baseURL = "http://api.bit.ly/v3/shorten?"
    login = "h5y1m141"
    longUrl = url
    
    Config = require("model/loadConfig")
    config = new Config()
    apiKey = config.getbitlyAPIKey()
    
    path = "#{baseURL}login=#{login}&longUrl=#{longUrl}&apiKey=#{apiKey}"
    Ti.API.info path
    xhr.open('GET',path)
    xhr.onload = ->
      body = JSON.parse(@responseText)
      if @status is 200
        Ti.API.info body
        callback(body)
    xhr.onerror = (e) ->
      Ti.API.info "bitly shorten fail"
    xhr.send()
    
    

module.exports = Twitter
