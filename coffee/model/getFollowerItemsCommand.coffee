class getFollowerItemsCommand extends baseCommand
  constructor:() ->
    
  execute:()  ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString("followerItems"))
    if items? is false or items is ""
      @_test()
      # @getFollowerItems()
    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
    
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(storedTo))
      mainTable.setData result
      @_hideStatusView()
  _test:() ->
    
    array ='[{"url_name":"mochiz@github","profile_image_url":"https://secure.gravatar.com/avatar/3ff4f5ddb4cf6ae28b0c27c37adbc30e?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"},{"url_name":"ofl@github","profile_image_url":"https://secure.gravatar.com/avatar/4a4f28aeda559d0a8f569e7069b12964?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"},{"url_name":"torshinor","profile_image_url":"https://si0.twimg.com/profile_images/1715071898/bakeneko_normal.png"},{"url_name":"sora_h","profile_image_url":"https://secure.gravatar.com/avatar/626ca235e8dab778c5bad6fc10e94ad8?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png"},{"url_name":"donayama","profile_image_url":"https://si0.twimg.com/profile_images/896848221/donayama_normal.jpg"},{"url_name":"atsusy","profile_image_url":"https://si0.twimg.com/profile_images/2306591484/DA074407-C036-4F58-AE56-0FBC5FBF0EB0_normal"},{"url_name":"masuidrive","profile_image_url":"https://secure.gravatar.com/avatar/0ec58a040e1e4e959c8566484b4bba19?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"},{"url_name":"hmsk","profile_image_url":"https://secure.gravatar.com/avatar/8358fe546d1b082b163f18a02eec145d?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"},{"url_name":"kyanny","profile_image_url":"https://secure.gravatar.com/avatar/fffd8bf62b842a46803fb07792029fa4?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png"}]'
    result = JSON.parse(array)
    resetRows = []
    mainTable.setData resetRows
    for item in result
      rows = []
      _url = "https://qiita.com/api/v1/users/#{item.url_name}/items?per_page=5"
      Ti.API.info _url
      xhr = Ti.Network.createHTTPClient()
      xhr.open("GET",_url)
      xhr.onload = ->
        if @.status is 200
          items = JSON.parse(@.responseText)
          if items? is true
            for item in items
              row = mainTableView.createRow(item)
              mainTable.appendRow(row,{animated:true})

      xhr.onerror = (e) ->
        error = JSON.parse(@.responseText)
        Ti.API.info error
      xhr.timeout = 5000  
      xhr.send()

      
    return
          
  getFollowerItems:() ->
    rows = []
    # @_showStatusView()
    
    qiitaUser.getfollowingUserList( (userList) ->
      rows = []
      # reset row data
      mainTable.setData rows
      for user in userList
        Ti.API.info user
        # Ti.API.info "https://qiita.com/api/v1/users/#{user.url_name}/items"        
        # xhr = Ti.Network.createHTTPClient()
        # xhr.open("GET","https://qiita.com/api/v1/users/#{user.url_name}/items")

        # xhr.onload = ->
        #   if @.status is 200
        #     items = JSON.parse(@.responseText)
        #     # if items? is true
        #     #   Ti.API.info items
              
      
        # xhr.onerror = (e) ->
        #   error = JSON.parse(@.responseText)
        #   Ti.API.info error
        # xhr.timeout = 5000  
        # xhr.send()
        @_hideStatusView()
        return
    )



  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()
                  
module.exports = getFollowerItemsCommand