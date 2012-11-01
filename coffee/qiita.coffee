class Qiita
  constructor: (@name) ->

    @user_name = 'h5y1m141@github'
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
    config = 
      url_name: @user_name
      password:'orih6254'
    xhr.open('POST','https://qiita.com/api/v1/auth')
    xhr.onload = ->
      body = JSON.parse(xhr.responseText)
      Ti.App.Properties.setString('QiitaToken', body.token)
    xhr.send(config)
    return true
  _request:(parameter,callback) ->
    self = @
    xhr = Ti.Network.createHTTPClient()
    xhr.setRequestHeader('User-Agent','Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A537a Safari/419.3')

    Ti.API.info parameter.method + ":" + parameter.url
    xhr.open(parameter.method,parameter.url)
    xhr.onload = ->
      Ti.API.info "_request method start"
      responseHeaders = xhr.responseHeaders
      Ti.API.info "#{xhr.responseText}"
      if responseHeaders
        relLink = self._convertLinkHeaderToJSON(responseHeaders.Link)
      else
        relLink = null
      json = JSON.parse(xhr.responseText)
      Ti.API.info "start callback function"
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
    @._request(param,callback)
  getFollowingUsers: (callback) ->
    param = @parameter.followingUsers
    @._request(param,callback)

  getFollowingTags: (callback) ->
    param = @parameter.followingTags
    @._request(param,callback)
  getFeed:(callback) ->
    param = @parameter.feed
    @._request(param,callback)
  getNextFeed:(url,callback) ->
    param =
      "url": url
      "method":'GET'

    @._request(param,callback)

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
    @._request(param,callback)
module.exports = Qiita

