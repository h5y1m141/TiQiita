class getStocksCommand
  constructor:() ->
    @value = 'storedStocks'
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry(@value))
      
    else
      @.getFeed()
      
    mainTable.setData result

    
    
  getFeed:() ->
    rows = []
    value = @value
    qiita.getFeed( (result,links) ->

      rows.push(t.createRow(json)) for json in result
      rows.push(t.createRowForLoadOldEntry(value))
      
      mainTable.setData rows
      Ti.App.Properties.setBool "stateMainTableSlide",false
      
    )
    return true
module.exports =  getStocksCommand 