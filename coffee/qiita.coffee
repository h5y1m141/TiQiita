class Qiita
  constructor: () ->
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/login.json')
    file = configJSON.read().toString()
    
    @config = JSON.parse(file)
    
    @user_name = @config.url_name
    @parameter =
      stocks:
        url:"https://qiita.com/api/v1/users/#{@user_name}/stocks"
        method:'GET'
      myStocks:
        url:"https://qiita.com/api/v1/stocks"
        method:'GET'
      feed:
        url:"https://qiita.com/api/v1/items"
        method:'GET'
      followingUsers:
        url:"https://qiita.com/api/v1/users/#{@user_name}/following_users"
        method:'GET'
      followingTags:
        url:"https://qiita.com/api/v1/users/#{@user_name}/following_tags"
        method:'GET'


  _auth:(param) ->

    if param is null
      requestParam = 
        url_name: @config.user_name
        password: @config.password
    else
      requestParam = param

    xhr = Ti.Network.createHTTPClient()
    xhr.open('POST','https://qiita.com/api/v1/auth')
    xhr.onload = ->
      body = JSON.parse(xhr.responseText)
      Ti.App.Properties.setString('QiitaToken', body.token)

    xhr.onerror = (e) ->
      error = JSON.parse(e)
      if error.type is "error"
        Ti.App.Properties.setString('QiitaTokenFail', error.error)
      
    xhr.send(requestParam)
    return true

  # オフラインやQiitaAPIに対するlimitがあるため
  # 本番までは以下のメソッドを通じてモックオブジェクトを
  # 呼び出す
  _mockObject:(value,storedStocksFlag,callback) ->
    followingTagsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/following_tags.json")
    itemsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/items.json")
    relLinkJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/relLink.json")

    stocksJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/stock.json")

    followingTags = JSON.parse(followingTagsJSON.read().toString())
    items = JSON.parse(itemsJSON.read().toString())
    relLink = JSON.parse(relLinkJSON.read().toString())
    

    if storedStocksFlag is true
      @._storedStocks(itemsJSON.read().toString())

    if value is "items"
      callback(items,relLink)
    else if value is "stocks"
      callback(items,relLink)
    else
      callback(followingTags,relLink)
    
    return true
        
  _storedStocks:(TiAppPropertiesName,strItems)->
    # JSONが含まれた配列をそのままTi.App.Properties.setList()
    # することが出来ないようなので、setStringを利用してキャッシュする

    stocks = JSON.parse(Ti.App.Properties.getString(TiAppPropertiesName))

    if stocks is null
      Ti.App.Properties.setString(TiAppPropertiesName,strItems)

    else

      merge = stocks.concat JSON.parse(strItems)
      Ti.App.Properties.setString(TiAppPropertiesName,JSON.stringify(merge))

    result = JSON.parse(Ti.App.Properties.getString(TiAppPropertiesName))
    Ti.API.info "stored under #{TiAppPropertiesName}. result is : #{result.length}"

    return true


  # Qiita APIにアクセスする一番肝となるメソッド
  #
  # - パラメータ組立(GET/POST/PUTメソッド&該当のURLエンドポイント)
  # - レスポンスヘッダー解析して、next/lastページのリンク取得
  # - 最終ページに到達した場合の処理
    
  _request:(parameter,value,callback) ->
    self = @
    xhr = Ti.Network.createHTTPClient()

    Ti.API.info parameter.method + ":" + parameter.url
    xhr.open(parameter.method,parameter.url)
    xhr.onload = ->

      responseHeaders = xhr.responseHeaders
      
      if responseHeaders.Link
        relLink = self._convertLinkHeaderToJSON(responseHeaders.Link)
      else
        relLink = null

      json = JSON.parse(xhr.responseText)

      
      if json is null
        self._isLastItems true
      else
        self._isLastItems false

      
      # QiitaAPIから取得した投稿情報をTi.App.Propertiesに都度突っ込み
      # これをローカルDB的に活用する
      
      if value isnt false
        self._storedStocks(value,xhr.responseText)

      callback(json,relLink)
      
    xhr.send()
    
  # Qiita APIの仕様としてページネーションの情報は以下のような形式で
  # レスポンスヘッダのLinkヘッダに含まれる
  # <https://qiita.com/api/v1/items?page=2>; rel="next", <https://qiita.com/api/v1/items?page=315>; rel="last"
  # この形式だと扱いづらいため[{"next":"http://..},{"last":"http://..}}]
  # というJSON形式に変換するためのメソッド

  _convertLinkHeaderToJSON:(value)->
    json = []
    links = value.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g)
    relValues = value.match(/first|prev|next|last/g)
    length = links.length-1

    for i in [0..length]
      _obj =
        "rel":relValues[i]
        "url":links[i]

      json.push(_obj)

    return json
    
  _mergeItems:(object1,object2) ->
    _ = require("lib/underscore-1.4.3.min")
    # return _.object(object1,object2)
    # return _.extend(object1,object2)
    object1 = object1.concat object2
    return _(object1).sortBy("created_at")

  _isLastItems:(flg) ->
    Ti.API.info "start isLastItems. flg is #{flg}"
    return Ti.App.properties.setBool "isLastPage",flg

  
  isConnected:() ->
    
    return Ti.Network.online    
    
  getStocks:(callback) ->
    param = @parameter.stocks
    @._request(param,'storedStocks',callback)
  getFollowingUsers: (callback) ->
    param = @parameter.followingUsers
    @._request(param,false,callback)

  getFollowingTags: (callback) ->
    param = @parameter.followingTags
    # 自分がフォローしてるタグの情報はAppPropertiesでキャッシュしたくないので
    # ２番めの引数をfalseにして対応

    @._request(param,false,callback)
    # @._mockObject("followingTags",false,callback)
  getFeed:(callback) ->
    param = @parameter.feed
    @._request(param,'storedStocks',callback)
    # @._mockObject("items",'storedStocks',callback)
    
  getNextFeed:(url,callback) ->
    param =
      "url": url
      "method":'GET'

    @._request(param,'storedStocks',callback)
    # @._mockObject("items",'storedStocks',callback)

  getMyStocks:(callback) ->
    token = Ti.App.Properties.getString('QiitaToken')
    if token is null
      @._auth()
    Ti.API.info "token is : #{Ti.App.Properties.getString('QiitaToken')}"

    param = 
      url:@parameter.myStocks.url + "?token=#{token}"
      method:@parameter.myStocks.method

    @._request(param,'storedMyStocks',callback)
    # @._mockObject("stocks",'storedMyStocks',callback)
    
  getMyFeed:(callback) ->
    token = Ti.App.Properties.getString('QiitaToken')
    if token is null
      @._auth()
    param = 
      url:@parameter.myFeed.url + "?token=#{token}"
      method:@parameter.myFeed.method

    @._request(param,false,callback)
  putStock:(uuid) ->
    token = Ti.App.Properties.getString('QiitaToken')
    if token is null
      @._auth()
      
    xhr = Ti.Network.createHTTPClient()
    method = 'PUT'
    xhr.setRequestHeader('X-HTTP-Method-Override',method)

    url = "https://qiita.com/api/v1/items/#{uuid}/stock"
    xhr.open(method,url)
    xhr.send({
      token:Ti.App.Properties.getString('QiitaToken')
    })
    xhr.onload = ->
      body = JSON.parse(xhr.responseText)
      actInd.hide()
      alertDialog = Ti.UI.createAlertDialog()
      alertDialog.setTitle "Qiitaへのストックが完了しました"
      alertDialog.show()
        
module.exports = Qiita

