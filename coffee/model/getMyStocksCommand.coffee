class getMyStocksCommand extends baseCommand
  constructor:() ->
    @value = 'storedMyStocks'
    @direction = "vertical"
    
  execute:() ->
    result = []
    Ti.API.debug @_currentSlideState()
    
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null

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