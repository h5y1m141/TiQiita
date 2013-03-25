class getFeedByTagCommand extends baseCommand
  constructor:(tagName) ->
    @tagName = tagName
    @direction = "vertical"
  execute:() ->
    result = []
    storedTo = "followingTag#{@tagName}"
    items = JSON.parse(Ti.App.Properties.getString(storedTo))
    
    if items? is false or items is ""
      @getFeedByTag()
    else  
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(storedTo))
      mainTable.setData result
      @_hideStatusView()
      

    

    
  getFeedByTag:() ->
    rows = []
    
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    storedTo = "followingTag#{@tagName}" 
    @_showStatusView()
    
    qiita.getFeedByTag(@tagName, (result,links) =>
      rows.push(mainTableView.createRow(json)) for json in result
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"  
      else
        rows.push(mainTableView.createRowForLoadOldEntry(storedTo))
        
      
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

      
module.exports = getFeedByTagCommand