class getFeedByTagCommand
  constructor:(tagName) ->
    @tagName = tagName

    
  execute:() ->
    storedTo = "followinTag#{@tagName}"
    Ti.API.info "getFeedByTagCommand run.#{Ti.App.Properties.getString(storedTo)}"
    result = []
    
    if Ti.App.Properties.getString(storedTo) is null
      showFlg = true
      @.getFeedByTag(showFlg)
    else
      items = JSON.parse(Ti.App.Properties.getString(storedTo))

      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry(storedTo))
      
    mainTable.setData result
    
  getFeedByTag:(showFlg) ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    storedTo = "followinTag#{@tagName}" 
    
    qiita.getFeedByTag(@tagName, (result,links) ->

      for link in links
        if link["rel"] == 'next'
          nextURL = link["url"]
        else if link["rel"] == 'last'
          lastURL = link["url"]
      Ti.API.info "storedTo: #{storedTo}"
      _obj = {label:storedTo,nextURL:nextURL,lastURL:lastURL}
      pageController.set(_obj)

      rows.push(t.createRow(json)) for json in result
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(t.createRowForLoadOldEntry(storedTo))
      Ti.API.info "show status check. showFlg is #{showFlg}"
      if showFlg is true
        return mainTable.setData rows
      else
        return null
    )

      
module.exports = getFeedByTagCommand