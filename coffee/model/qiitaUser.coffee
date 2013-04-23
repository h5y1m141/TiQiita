class qiitaUser
  constructor:(url_name)->
    @url_name = url_name
  getfollowingUserList:(callback) ->
    param =
      method:'GET'
      url:"https://qiita.com/api/v1/users/#{@url_name}/following_users"


    return @_request(param,callback)
        
  getUserInfo:(callback) ->
    param =
      method:'GET'
      url:"https://qiita.com/api/v1/users/#{@url_name}"
      
    return @_request(param,callback)
        
    
  _request:(param,callback) ->
    self = @
    xhr = Ti.Network.createHTTPClient()
    xhr.open(param.method,param.url)
    xhr.onload = ->

      if @.status is 200
        
        json = JSON.parse(@.responseText)
        alert json.length
        # self._cached(@.responseText)

        return callback(json)
    xhr.onerror = (e) ->
      error = JSON.parse(@.responseText)
      Ti.API.info "status code: #{@.status} and Error:#{error.error}"
      
    xhr.timeout = 5000
    xhr.send()
    return
    
  _cached:(userInfo)->
    # result = Titanium.App.Properties.getString "qiitaUserList"
    # localUserInfo = JSON.parse(result)

    Titanium.App.Properties.setString("qiitaUserList",userInfo)
    return true



    
module.exports = qiitaUser  

