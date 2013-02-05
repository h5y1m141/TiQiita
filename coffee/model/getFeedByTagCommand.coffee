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
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry(storedTo))

    else
      Ti.API.info "#{storedTo} isn't cached so that get items via Qiita API"
      showFlg = true
      @.getFeedByTag(showFlg)

    mainTable.setData result      

    
  getFeedByTag:(showFlg) ->
    rows = []
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    storedTo = "followingTag#{@tagName}" 
    
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
    return true
      
module.exports = getFeedByTagCommand