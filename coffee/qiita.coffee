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


  _auth:() ->
    xhr = Ti.Network.createHTTPClient()
    param = 
      url_name: @config.user_name
      password: @config.password
    xhr.open('POST','https://qiita.com/api/v1/auth')
    xhr.onload = ->
      body = JSON.parse(xhr.responseText)
      Ti.App.Properties.setString('QiitaToken', body.token)
    xhr.send(param)
    return true

  # オフラインやQiitaAPIに対するlimitがあるため
  # 本番までは以下のメソッドを通じてモックオブジェクトを
  # 呼び出す
  _mockObject:(value,storedStocksFlag,callback) ->
    followingTagsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/following_tags.json")
    itemsJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/items.json")
    relLinkJSON = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"test/relLink.json")

    followingTags = JSON.parse(followingTagsJSON.read().toString())
    items = JSON.parse(itemsJSON.read().toString())
    relLink = JSON.parse(relLinkJSON.read().toString())
    
    # QiitaAPIから取得した投稿情報をTi.App.Propertiesに都度突っ込み
    # これをローカルDB的に活用する
    # Ti.App.Properties.setList("storedStocks",json)
    if storedStocksFlag is true
      @._storedStocks(itemsJSON.read().toString())

    if value is "items"
      callback(items,relLink)
    else
      callback(followingTags,relLink)
    
    return true
    
  _storedStocks:(strItems)->
    # JSONが含まれた配列をそのままTi.App.Properties.setList()
    # することが出来ないようなので、setStringを利用してキャッシュする

    stocks = JSON.parse(Ti.App.Properties.getString('storedStocks'))
    if stocks is null
      Ti.App.Properties.setString('storedStocks',strItems)

    else
      # merge two json objects
      # http://developer.appcelerator.com/question/136239/merge-two-json-objects-dynamicallyandroid
      obj1 = strItems.substring(0, strItems.length - 1)
      stocks = Ti.App.Properties.getString('storedStocks')
      obj2 = stocks.substring(1,stocks.length)
      Ti.API.info obj1
      merge = "#{obj1},#{obj2}"
      Ti.App.Properties.setString('storedStocks',merge)

    result = JSON.parse(Ti.App.Properties.getString('storedStocks'))
    Ti.API.info "_storedStocks finish. result is : #{result.length}"

    return true
    
  _request:(parameter,storedStocksFlag,callback) ->
    self = @
    xhr = Ti.Network.createHTTPClient()

    Ti.API.info parameter.method + ":" + parameter.url
    xhr.open(parameter.method,parameter.url)
    xhr.onload = ->
      Ti.API.info "_request method start"
      responseHeaders = xhr.responseHeaders
      
      if responseHeaders.Link
        relLink = self._convertLinkHeaderToJSON(responseHeaders.Link)
      else
        relLink = null

      json = JSON.parse(xhr.responseText)
      
      # QiitaAPIから取得した投稿情報をTi.App.Propertiesに都度突っ込み
      # これをローカルDB的に活用する
      # Ti.App.Properties.setList("storedStocks",json)
      if storedStocksFlag is true

        self._storedStocks(xhr.responseText)


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
    
  getStocks:(callback) ->
    param = @parameter.stocks
    @._request(param,true,callback)
  getFollowingUsers: (callback) ->
    param = @parameter.followingUsers
    @._request(param,false,callback)

  getFollowingTags: (callback) ->
    param = @parameter.followingTags
    # 自分がフォローしてるタグの情報はAppPropertiesでキャッシュしたくないので
    # ２番めの引数をfalseにして対応

    # @._request(param,false,callback)
    @._mockObject("followingTags",false,callback)
  getFeed:(callback) ->
    param = @parameter.feed
    # @._request(param,true,callback)
    @._mockObject("items",true,callback)
    
  getNextFeed:(url,callback) ->
    param =
      "url": url
      "method":'GET'

    # @._request(param,true,callback)
    @._mockObject("items",true,callback)

  getMyStocks:(callback) ->
    token = Ti.App.Properties.getString('QiitaToken')
    if token is null
      @._auth()
    param = 
      url:@parameter.myStocks.url + "?token=#{token}"
      method:@parameter.myStocks.url
    Ti.API.info(param.url)
    @._request(param,callback)
  getMyFeed:(callback) ->
    token = Ti.App.Properties.getString('QiitaToken')
    if token is null
      @._auth()
    param = 
      url:@parameter.myFeed.url + "?token=#{token}"
      method:@parameter.myFeed.method
    Ti.API.info(param.url)
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

