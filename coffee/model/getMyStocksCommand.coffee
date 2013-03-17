class getMyStocksCommand extends baseCommand
  constructor:() ->
    @value = 'storedMyStocks'
    @direction = "vertical"

  execute:() ->
    result = []

    @_showStatusView()

    items = JSON.parse(Ti.App.Properties.getString(@value))

    if items isnt null
      if @_currentSlideState() is "default"
        @_showStatusView()
      else
        @_hideStatusView()
    
      
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      
    else
      @.getMyStocks()
      
    mainTable.setData result  

    
      
  getMyStocks:() ->

    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    value = @value

    qiita.getMyStocks( (result,links) ->
      @_hideStatusView()
      rows.push(mainTableView.createRow(json)) for json in result
      
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(mainTableView.createRowForLoadOldEntry(value))
              
      mainTable.setData rows

    )

    return true

  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()
      
module.exports = getMyStocksCommand