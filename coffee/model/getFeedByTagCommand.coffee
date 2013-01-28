class getFeedByTagCommand
  constructor:(followinTagsName,tagName) ->
    @followinTagsName = followinTagsName
    @tagName = tagName
    
  execute:() ->
    storedTo = "followinTags#{@tagName}"
    items = JSON.parse(Ti.App.Properties.getString(storedTo))
    result = []
    Ti.API.info "getFeedByTagCommand!  items is #{items}"
    if items isnt null
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry(storedTo))
    else
      showFlg = true
      @.getFeedByTag(showFlg)
      
    mainTable.setData result
    
  getFeedByTag:(showFlg) ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    storedTo = "followinTags#{@tagName}"
    qiita.getFeedByTag(@tagName, (result,links) ->
      for link in links
        if link["rel"] == 'next'
          nextURL = link["url"]
        else if link["rel"] == 'last'
          lastURL = link["url"]

      _obj = {label:storedTo,nextURL:nextURL,lastURL:lastURL}
      pageController.set(_obj)

      rows.push(t.createRow(json)) for json in result
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
      else
        Ti.API.info "loadOldEntry show"
        rows.push(t.createRowForLoadOldEntry(storedTo))
        
      if showFlg is true
        return mainTable.setData rows
      else
        return null
    )

      
module.exports = getFeedByTagCommand