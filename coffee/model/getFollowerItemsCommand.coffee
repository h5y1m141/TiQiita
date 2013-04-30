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
      result.push(mainTableView.createRowForLoadOldEntry(storedTo))
      mainTable.setData result
      @_hideStatusView()
          
  getFollowerItems:() ->

    qiitaUser.getfollowingUserList( (result) =>

      for item in result
        _url = "https://qiita.com/api/v1/users/#{item.url_name}/items?per_page=5"
        _items = []
        xhr = Ti.Network.createHTTPClient()
        xhr.open("GET",_url)
        xhr.onload = ->
          if @.status is 200
            items = JSON.parse(@.responseText)
            if items isnt null
              Ti.API.info typeof items
              for item in items
                _items.push item

        xhr.onerror = (e) ->
          error = JSON.parse(@.responseText)
          Ti.API.info error
        xhr.timeout = 5000  
        xhr.send()
        

      setTimeout (=>
        result = []
        _items.sort( (a, b) ->

          (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
        )
        
        for _item in _items
          result.push(mainTableView.createRow(_item))
          
        mainTable.setData result
          
      ),10000

    )
    


  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()
                  
module.exports = getFollowerItemsCommand