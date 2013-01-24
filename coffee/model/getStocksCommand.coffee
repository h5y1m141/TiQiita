class getStocksCommand
  constructor:() ->
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString('storedStocks'))
    if items isnt null
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry('storedStocks'))
    else
      @.getFeed()

    mainTable.setData result
    
  getFeed:() ->
    rows = []
    actInd.message = 'loading...'
    actInd.backgroundColor = '#222'
    actInd.opacity = 1.0

    actInd.show()
    qiita.getFeed( (result,links) ->
      rows.push(t.createRow(json)) for json in result
      rows.push(t.createRowForLoadOldEntry('storedStocks'))
      mainTable.setData rows
      actInd.hide()
      return true
    )
    
module.exports =  getStocksCommand 