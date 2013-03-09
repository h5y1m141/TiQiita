class getStocksCommand
  constructor:() ->
    @value = 'storedStocks'
    @direction = "vertical"
  execute:() ->
    result = []
    @_showStatusView()
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      @_hideStatusView()

      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      
    else
      @.getFeed()
      
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
    
  _showStatusView:() ->
    Ti.API.info "データの読み込み。statusView表示"
    Ti.App.Properties.setBool "stateMainTableSlide",false
    return mainContoroller.slideMainTable(@direction)


  _hideStatusView:() ->
    Ti.API.info "データの読み込みが完了したらstatusViewを元に戻す"
    Ti.App.Properties.setBool "stateMainTableSlide",true
    mainContoroller.slideMainTable(@direction)

module.exports =  getStocksCommand 