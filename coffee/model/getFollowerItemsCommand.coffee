class getFollowerItemsCommand extends baseCommand
  constructor:() ->

  execute:()  ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString("followerItems"))
    if items? is false or items is ""

      @getFollowerItems()
    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
    
      result.push(mainTableView.createRow(json)) for json in items
      mainTable.setData result
      @_hideStatusView()
          
  getFollowerItems:() ->
    @_showStatusView()
    qiitaUser.getfollowingUserList( (userList) =>
      # 1)フォローしてるユーザ情報のuserListを
      # 順番にループして個々のユーザの投稿情報を取得
      for item in userList
        _url = "https://qiita.com/api/v1/users/#{item.url_name}/items?per_page=20"
        # _url = "https://qiita.com/api/v1/users/#{item.url_name}/items"
        _items = []
        xhr = Ti.Network.createHTTPClient()
        xhr.open("GET",_url)
        xhr.onload = ->
          if @.status is 200
            items = JSON.parse(@.responseText)
            if items isnt null
              for item in items
                _items.push item

        xhr.onerror = (e) ->
          error = JSON.parse(@.responseText)
          Ti.API.info error
        xhr.timeout = 5000  
        xhr.send()
        
      # 1)の処理は非同期で実施されるため、最終的に
      # 全部のユーザの投稿情報を取得するのに時間がかかるため
      # ひとまず10秒間まってから、mainTable.setDataの処理と
      # 取得した投稿情報のローカルへのキャッシュを実施
      setTimeout (=>
        result = []
        _items.sort( (a, b) ->
          (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
        )
        # フォローしてるユーザの投稿情報をローカルにキャッシュ
        Ti.App.Properties.setString("followerItems",JSON.stringify(_items))
        for _item in _items
          result.push(mainTableView.createRow(_item))
          
        mainTable.setData result
        @_hideStatusView() 
          
      ),10000

    )
    


  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()
                  
module.exports = getFollowerItemsCommand