class getOldEntryCommand extends baseCommand
  constructor:() ->
    @value = 'storedStocks'
    @direction = "vertical"

  execute:() ->
    result = []
    if @_currentSlideState() is "default"
      @_showStatusView()

    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      if @_currentSlideState() is "default"
        @_showStatusView()
      else
        @_hideStatusView()


      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(@value))
      
    else
      @getFeed()
      
    mainTable.setData result

    
  loadOldEntry: (storedTo) ->
    MAXITEMCOUNT = 20
    @_hideStatusView()
    currentPage = Ti.App.Properties.getString "currentPage"
    nextURL = Ti.App.Properties.getString "#{currentPage}nextURL"
    
    if nextURL isnt null
      qiita.getNextFeed(nextURL,storedTo,(result) =>
        Ti.API.info "getNextFeed start. result is #{result.length}"
        @_hideStatusView()

        # ここで投稿件数をチェックして、20件以下だったら過去のを
        # 読み込むrowを非表示にすればOK
        if result.length isnt MAXITEMCOUNT
          mainTableView.hideLastRow()
        else
          for json in result
            r = mainTableView.createRow(json)
            lastIndex = mainTableView.lastRowIndex()
            mainTableView.insertRow(lastIndex,r)
        
      )
    return true    

  _currentSlideState:() ->
    super()

  _showStatusView:() ->
    super()

  _hideStatusView:() ->
    super()

module.exports = getOldEntryCommand    