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
    Ti.API.info "[ACTION] スライド開始"
    progressBar.value = 0
    progressBar.show()    
    statusView.animate({
        duration:400
        top:0
    },() ->
      Ti.API.debug "mainTable を上にずらす"
      mainTable.animate({
        duration:200
        top:50
      })
    )


  _hideStatusView:() ->
    Ti.API.info "[ACTION] スライドから標準状態に戻る。垂直方向"
    mainTable.animate({
      duration:200
      top:0
    },()->
      Ti.API.debug "mainTable back"
      progressBar.hide()
      statusView.animate({
        duration:400
        top:-50
      })
    )



module.exports =  getStocksCommand 