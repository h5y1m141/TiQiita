class getMyStocksCommand
  constructor:() ->
    @value = 'storedMyStocks'
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString(@value))

    if items isnt null
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      
    else
      @.getMyStocks()
      
    mainTable.setData result  

    
      
  getMyStocks:() ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    value = @value
    direction = "vertical"
    Ti.App.Properties.setBool 'stateMainTableSlide',false
    controller.slideMainTable(direction)

    qiita.getMyStocks( (result,links) ->

      rows.push(mainTableView.createRow(json)) for json in result
      
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(mainTableView.createRowForLoadOldEntry(value))
        
      Ti.App.Properties.setBool "stateMainTableSlide",false
      mainTable.setData rows
    )

    return true
      
module.exports = getMyStocksCommand