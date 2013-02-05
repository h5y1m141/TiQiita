class getMyStocksCommand
  constructor:() ->
    @value = 'storedMyStocks'
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString(@value))

    if items isnt null
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry(@value))
    else

      @.getMyStocks()
      
    mainTable.setData result    
      
  getMyStocks:() ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    value = @value
    qiita.getMyStocks( (result,links) ->

      rows.push(t.createRow(json)) for json in result
      
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(t.createRowForLoadOldEntry(value))
        mainTable.setData rows
    )

    return true
      
module.exports = getMyStocksCommand