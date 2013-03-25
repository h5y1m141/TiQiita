class getStocksCommand extends baseCommand
  constructor:() ->
    @value = 'storedStocks'
    @direction = "vertical"

  execute:() ->
    result = []
    
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      Ti.API.debug "load cached item and mainTable reset"
      
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      mainTable.setData result
      @_hideStatusView()

    else
      @getFeed()
      
    

    
  getFeed:() ->
    Ti.API.debug "getFeed start"
    rows = []
    value = @value
    @_showStatusView()
    

    qiita.getFeed( (result,links) =>
      

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