class getMyStocksCommand
  constructor:() ->
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString('storedMyStocks'))

    if items isnt null
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry('storedMyStocks'))
    else
      showFlg = false
      @.getMyStocks(showFlg)
      
    mainTable.setData result    
      
  getMyStocks:(showFlg) ->
    actInd.message = 'loading...'
    actInd.backgroundColor = '#222'
    actInd.opacity = 1.0
    actInd.zIndex = 10
    actInd.show()
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数

    qiita.getMyStocks( (result) ->
      rows.push(t.createRow(json)) for json in result
      
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(t.createRowForLoadOldEntry('storedMyStocks'))
      
      actInd.hide()
      
      if showFlg is true
        return mainTable.setData rows
      else
        return
    )

    return true
      
module.exports = getMyStocksCommand