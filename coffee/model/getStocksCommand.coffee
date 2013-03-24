class getStocksCommand extends baseCommand
  constructor:() ->
    @value = 'storedStocks'
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
      @getFeed()
      
    mainTable.setData result

    
  getFeed:() ->
    rows = []
    value = @value
    

    qiita.getFeed( (result,links) =>
      @_hideStatusView()

      rows.push(mainTableView.createRow(json)) for json in result
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


module.exports =  getStocksCommand 