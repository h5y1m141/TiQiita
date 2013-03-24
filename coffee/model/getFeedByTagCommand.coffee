class getFeedByTagCommand extends baseCommand
  constructor:(tagName) ->
    @tagName = tagName
    @direction = "vertical"
  execute:() ->
    result = []
    Ti.API.debug @_currentSlideState()
    @_showStatusView()

    storedTo = "followingTag#{@tagName}"
    items = JSON.parse(Ti.App.Properties.getString(storedTo))

    if items isnt null
      if @_currentSlideState() is "default"
        @_showStatusView()
      else
        @_hideStatusView()
      
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(storedTo))
      
    else
      
      @getFeedByTag()
      
    mainTable.setData result  

    

    
  getFeedByTag:() ->
    rows = []
    
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    storedTo = "followingTag#{@tagName}" 

    qiita.getFeedByTag(@tagName, (result,links) =>
      @_hideStatusView()
      rows.push(mainTableView.createRow(json)) for json in result
      if result.length isnt MAXITEMCOUNT
        
      else
        
        rows.push(mainTableView.createRowForLoadOldEntry(storedTo))
        
      
      mainTable.setData rows
      

    )
    return true

  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()

      
module.exports = getFeedByTagCommand