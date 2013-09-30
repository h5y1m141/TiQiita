class Qiita
  constructor: () ->
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/login.json')
    file = configJSON.read().toString()
    
    @config = JSON.parse(file)
    QiitaLoginID = Ti.App.Properties.getString 'QiitaLoginID'

    if QiitaLoginID is null
      @user_name = @config.url_name
    else
      @user_name = QiitaLoginID

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

      followingTags:
        url:"https://qiita.com/api/v1/users/#{@user_name}/following_tags?per_page=100"
        method:'GET'


  _auth:(param,callback) ->

    if typeof param isnt "undefined" and param isnt null
      requestParam = param
    else if Ti.App.Properties.getString('QiitaLoginID') isnt null
      requestParam = {
        url_name: Ti.App.Properties.getString('QiitaLoginID'),
        password: Ti.App.Properties.getString('QiitaLoginPassword')
      }
    else
      requestParam = {
        url_name: @config.url_name,
        password: @config.password
      }

    Ti.API.info "qiita._auth requestParam url_name is #{requestParam.url_name}"
    xhr = Ti.Network.createHTTPClient()

    xhr.open('POST','https://qiita.com/api/v1/auth')
    xhr.onload = ->
      body = JSON.parse(@.responseText)
      Ti.API.info "status code: #{@.status}"
      if @.status is 200
        Ti.App.Properties.setString('QiitaToken', body.token)
        token = body.token

      else
        token = null
        
      callback(token)

        
    xhr.onerror = (e) ->
      Ti.API.info "status code: #{@.status}"
      Ti.App.Properties.setString('QiitaToken', null)
      error = JSON.parse(@.responseText)
      Ti.API.info error.error
      Ti.App.Properties.setString('QiitaTokenFail', error.error)
      # controller.loginFail error.error
      token = null      
      callback(token)  
            
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
        
  _storedStocks:(_storedTo,strItems)->
    # JSONが含まれた配列をそのままTi.App.Properties.setList()
    # することが出来ないようなので、setStringを利用してキャッシュする
    cachedItems = Ti.App.Properties.getString(_storedTo)

    stocks = JSON.parse(cachedItems)

    Ti.API.info stocks.length if stocks isnt null
    if stocks is null
      length = JSON.parse(strItems)
      Ti.API.info "_storedStocks start"
      Ti.App.Properties.setString(_storedTo,strItems)

    else
      Ti.API.info "_storedStocks merge start"
      merge = stocks.concat JSON.parse(strItems)
      Ti.App.Properties.setString(_storedTo,JSON.stringify(merge))
      
    ## debug
    result = JSON.parse(Ti.App.Properties.getString(_storedTo))
    Ti.API.info "_storedStocks finish : #{result.length}"
    



  # Qiita APIにアクセスする一番肝となるメソッド
  #
  # - パラメータ組立(GET/POST/PUTメソッド&該当のURLエンドポイント)
  # - レスポンスヘッダー解析して、next/lastページのリンク取得
  # - 最終ページに到達した場合の処理
    
  _request:(parameter,storedTo,callback) ->
    
    self = @
      
    xhr = Ti.Network.createHTTPClient()


    Ti.API.info parameter.method + ":" + parameter.url
    xhr.open(parameter.method,parameter.url)
    
    
    xhr.onload = ->
      json = JSON.parse(@.responseText)

      # アプリ起動中にキャッシュしたい情報かどうかをこのstoredToパラメータ
      # にて行う。
      if storedTo is "followingTags" or storedTo is false
        Ti.API.debug "キャッシュ処理は実施しませんでした"
      else

        Ti.API.info "start _storedStocks #{storedTo}"
        # QiitaAPIから取得した投稿情報をTi.App.Propertiesに都度突っ込み
        # これをローカルDB的に活用する
        
        self._storedStocks(storedTo,@.responseText)

        # ページネーションに必要となる
        # 次ページと最終ページのURLのハンドリング処理
        responseHeaders = @.responseHeaders
        if responseHeaders.Link
          relLink = self._convertLinkHeaderToJSON(responseHeaders.Link)
          # Ti.API.info "start self._parsedResponseHeader. storedTo is #{storedTo}"
          self._parsedResponseHeader(relLink,storedTo)
        else
          relLink = null

      callback(json,relLink)

    xhr.onerror = (e) ->
      error = JSON.parse(@.responseText)
      Ti.API.debug "_request method error.#{error}"
            
      
      
    xhr.timeout = 5000
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
    

  _parsedResponseHeader:(header,storedTo) ->
    
    for link in header

      if link["rel"] is 'next'
        nextURL = link["url"]
        baseURL = link["url"].split("?")
        firstURL = baseURL[0]
      else if link["rel"] is 'last'
        lastURL = link["url"]

      else
        Ti.API.info "done"
        
    if storedTo isnt "followingTags"
      Ti.API.info "first url is: #{firstURL} next url is :#{nextURL}"

    return true
  
  isConnected:() ->
    
    return Ti.Network.online    
    
  getStocks:(callback) ->
    param = @parameter.stocks
    @._request(param,'storedStocks',callback)
  getFollowingUsers: (callback) ->
    param = @parameter.followingUsers
    @._request(param,false,callback)
    
  getTags: (callback) ->
    param = @parameter.tags
    @._request(param,false,callback)
    
  getFollowingTags: (callback) ->

    param =
      url:"https://qiita.com/api/v1/users/#{@user_name}/following_tags"
      method:'GET'
    
    @._request(param,"followingTags",callback)
    # @._mockObject("followingTags",false,callback)
  getFeed:(callback) ->
    param = @parameter.feed
    @._request(param,'items',callback)
    # @._mockObject("items",'storedStocks',callback)

        
  getNextFeed:(url,storedTo,callback) ->
    param =
      "url": url
      "method":'GET'
    
    @._request(param,storedTo,callback)
    # @._mockObject("items",'storedStocks',callback)

  getFeedByTag:(tagName,callback) ->
    url = "https://qiita.com/api/v1/tags/#{tagName}/items"
    param =
      "url": url
      "method":'GET'
    @._request(param,tagName,callback)

  getUserInfo:(userName,callback) ->
    url = "https://qiita.com/api/v1/users/#{userName}"
    param =
      "url": url
      "method":'GET'

    @._request(param,false,callback)

  getMyStocks:(callback) =>

    param = 
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')

    @._auth(param, (token)=>
      if token is null
        alert "QiitaのユーザIDかパスワードが間違ってます"
      else
      requestParam = 
        url:"https://qiita.com/api/v1/stocks?token=#{token}"
        method:'GET'
        
      @._request(requestParam,"myStocks",callback)
    )
    
  getMyFeed:(callback) ->
    token = Ti.App.Properties.getString('QiitaToken')
    if token is null
      @._auth()
    param = 
      url:@parameter.myFeed.url + "?token=#{token}"
      method:@parameter.myFeed.method

    @._request(param,false,callback)
  putStock:(uuid,callback) ->
    param =
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')

    @_auth(param, (token)=>
      xhr = Ti.Network.createHTTPClient()
      method = 'PUT'
      url = "https://qiita.com/api/v1/items/#{uuid}/stock"
      xhr.open(method,url)
      xhr.setRequestHeader('X-HTTP-Method-Override',method)
      xhr.onload = ->

        body = JSON.parse(xhr.responseText)
        if @status is 204
          callback('success')
        else
          callback('error')
        
      xhr.onerror = (e) ->
        message: "StatusCode: #{@.status}"
        
      Ti.API.debug Ti.App.Properties.getString('QiitaToken')
        
      xhr.send({
        token:Ti.App.Properties.getString('QiitaToken')
      })
    )

  setRequestParameter:(name) ->
    Ti.API.info "setRequestParameter start.user name id #{@user_name} and name is #{name}"
    @user_name = name
    Ti.API.info "setRequestParameter done.#{@parameter.followingTag}"
    return true      
      
      
        
module.exports = Qiita

