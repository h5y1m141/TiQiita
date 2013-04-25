class getMyStocksCommand extends baseCommand
  constructor:() ->
    @value = 'storedMyStocks'
    @direction = "vertical"
    
  execute:() ->
    result = []
    Ti.API.debug @_currentSlideState()
    
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      # items.sort( (a, b) ->

      #   (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      # )

      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      @_hideStatusView()
      mainTable.setData result  
      
    else
      @getMyStocks()
      
      
  getMyStocks:() ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    value = @value
    @_showStatusView()

    qiita.getMyStocks( (result,links) =>
      # http://d.hatena.ne.jp/yatemmma/20110723/1311534794を参考に実装
      # なお比較した結果、1を最初に返すと更新日古い順番にソートされる
      # result.sort( (a, b) ->

      #   (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      # )
      
      rows.push(mainTableView.createRow(json)) for json in result
      
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
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

      
module.exports = getMyStocksCommand