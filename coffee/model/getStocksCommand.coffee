class getStocksCommand extends baseCommand
  constructor:() ->
    @value = 'storedStocks'
    @direction = "vertical"

  execute:() ->
    result = []
    
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items? is false or items is ""
      @getFeed()
    else
      Ti.API.debug "load cached item and mainTable reset"
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
      
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      
      mainTable.setData result
      @_hideStatusView()

    
  getFeed:() ->
    Ti.API.debug "getFeed start"
    rows = []
    value = @value
    @_showStatusView()
    

    qiita.getFeed( (result,links) =>
      
      # http://d.hatena.ne.jp/yatemmma/20110723/1311534794を参考に実装
      # なお比較した結果、1を最初に返すと更新日古い順番にソートされる
      result.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )

      rows.push(mainTableView.createRow(json)) for json in result
      rows.push(mainTableView.createRowForLoadOldEntry(value))
      
      mainTable.setData rows
      @_hideStatusView()
      
    )
    return true

  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()

module.exports =  getStocksCommand 