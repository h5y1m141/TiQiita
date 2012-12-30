class qiitaController
  constructor: () ->
    @state = new defaultState()
    
    
    
  loadOldEntry: () ->
    url = Ti.App.Properties.getString('nextPageURL')
    Ti.API.info "NEXTPAGE:#{url}"
    actInd.backgroundColor = '#222'
    actInd.opacity = 0.8
    actInd.show()
        
    qiita.getNextFeed(url,(result,links) ->
      for link in links
        if link["rel"] == 'next'
          Ti.App.Properties.setString('nextPageURL',link["url"])

      for json in result
        r = t.createRow(json)
        lastIndex = t.lastRowIndex()

        t.insertRow(lastIndex,r)
        actInd.hide()
    )
    return true

  stockItemToQiita: (uuid) ->
    uuid = Ti.App.Properties.getString('stockUUID')
    actInd.backgroundColor = '#222'
    actInd.message = 'Posting...'
    actInd.zIndex = 20
    actInd.show()  

    qiita.putStock(uuid)
    
    return true


  sessionItem: (json) ->
    Ti.API.info "start sessionItem. url is #{json.url}. uuid is #{json.uuid}"
    if json
      Ti.App.Properties.setString('stockURL',json.url)
      Ti.App.Properties.setString('stockUUID',json.uuid)
      Ti.App.Properties.setString('stockID',json.id)
  
  slideMainTable: () ->
    Ti.API.info "slideMainTable start. state is #{@state.sayState()}"
    if Ti.App.Properties.getBool("stateMainTableSlide") is false
      @state = @state.moveForward()
    else
      @state = @state.moveBackward()
      
      
  webViewContentsUpdate: (body) ->
    return webview.contentsUpdate(body)
    
  webViewHeaderUpdate: (json) ->

    return webview.headerUpdate(json)

    
  moveToWebViewWindow: () ->    
    actionBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.ACTION

    actionBtn.addEventListener('click',()->

      dialog = Ti.UI.createOptionDialog()
      dialog.setTitle "どの処理を実行しますか？"
      dialog.setOptions(["ストックする","キャンセル"])
      dialog.setCancel(1)
      dialog.addEventListener('click',(event) ->
        Ti.API.info "start dialog action.Event is #{event.index}"
        switch event.index
          when 0
            controller.stockItemToQiita()
      )
      dialog.show()
    )
    webview.show()
    webWindow.rightNavButton = actionBtn
    return tab.open(webWindow)


  show: () ->
    alert "start contoroller show"

  login:(flg) ->
    Ti.API.info "start Qiita Login. login flag is #{flg}"
    return true

                  


module.exports = qiitaController