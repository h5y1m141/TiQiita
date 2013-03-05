class getStocksCommand
  constructor:() ->
    @value = 'storedStocks'
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      
    else
      @.getFeed()
      
    mainTable.setData result

    
    
  getFeed:() ->
    rows = []
    value = @value
    direction = "vertical"

    qiita.getFeed( (result,links) ->

      rows.push(mainTableView.createRow(json)) for json in result
      rows.push(mainTableView.createRowForLoadOldEntry(value))
      
      mainTable.setData rows
      Ti.App.Properties.setBool "stateMainTableSlide",true
      mainContoroller.slideMainTable(direction)
      
      
    )
    return true
module.exports =  getStocksCommand 