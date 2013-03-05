class getFeedByTagCommand
  constructor:(tagName) ->
    @tagName = tagName

    
  execute:() ->
    storedTo = "followingTag#{@tagName}"
    Ti.API.info "getFeedByTagCommand execute! storedTo is #{storedTo}"
    result = []
    items = JSON.parse(Ti.App.Properties.getString(storedTo))

    if items isnt null
      Ti.API.info "cache loaded. items is #{items.length}"
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(storedTo))
      
    else
      Ti.API.info "#{storedTo} isn't cached so that get items via Qiita API"
      @.getFeedByTag()
      
    mainTable.setData result  

    

    
  getFeedByTag:() ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    storedTo = "followingTag#{@tagName}" 
    direction = "vertical"
    Ti.App.Properties.setBool 'stateMainTableSlide',false
    mainContoroller.slideMainTable(direction)
    
    qiita.getFeedByTag(@tagName, (result,links) ->
      rows.push(mainTableView.createRow(json)) for json in result
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(mainTableView.createRowForLoadOldEntry(storedTo))
        
      Ti.App.Properties.setBool "stateMainTableSlide",false
      mainTable.setData rows

    )
    return true
      
module.exports = getFeedByTagCommand