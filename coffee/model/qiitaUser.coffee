class qiitaUser
  constructor:(url_name)->
    @url_name = url_name
    
  getUserInfo:(callback) ->
    xhr = Ti.Network.createHTTPClient()
    xhr.open('GET',"https://qiita.com/api/v1/users/#{@url_name}")
    xhr.onload = ->
      if @.status is 200
        json = JSON.parse(@.responseText)
        return callback(json)
    xhr.onerror = (e) ->
      error = JSON.parse(@.responseText)
      Ti.API.info "status code: #{@.status} and Error:#{error.error}"      

    xhr.send()
    return    

module.exports = qiitaUser  

