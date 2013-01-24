class qiitaController
  constructor: () ->
    @state = new defaultState()
    @message =
      network:
        timeout:"ネットワーク接続できないかサーバがダウンしてるようです"
    Client = require("controllers/client")
    currentPage = require("model/currentPage")
    @page = new currentPage()
    @client = new Client()
    

    
  loadEntry: () ->
    actInd.backgroundColor = '#222'
    actInd.zIndex = 10
    actInd.show()
    
    qiita.getFeed( (result,links) ->
      rows = []
      for link in links
        if link["rel"] == 'next'
          Ti.App.Properties.setString('nextPageURL',link["url"])
        
      rows.push(t.createRow(json)) for json in result
      rows.push(t.createRowForLoadOldEntry('storedStocks'))
      mainTable.setData rows
      actInd.hide()
      return true
    )  
    
  loadOldEntry: (storedTo) ->
    url = Ti.App.Properties.getString('nextPageURL')
    Ti.API.info "loadOldEntry start. NEXTPAGE:#{url}"
    Ti.API.info "storedTo is #{storedTo}"
    actInd.backgroundColor = '#222'
    actInd.opacity = 1.0
    actInd.zIndex = 10
    actInd.show()
    MAXITEMCOUNT = 20  
    qiita.getNextFeed(url,storedTo,(result) ->
      Ti.API.info "getNextFeed start. result is #{result.length}"

      # ここで投稿件数をチェックして、20件以下だったら過去のを
      # 読み込むrowを非表示にすればOK
      if result.length isnt MAXITEMCOUNT
        Ti.API.info "loadOldEntry hide"
        t.hideLastRow()
      else
        Ti.API.info "loadOldEntry show"
        for json in result
          r = t.createRow(json)
          lastIndex = t.lastRowIndex()
          t.insertRow(lastIndex,r)
          
      actInd.hide()
        
    )
    return true
    
  getFeedByTag:(showFlg,tag) ->
    qiita.getFeedByTag(tag (result) ->
      actInd.hide()
      return true
    )
      
    
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

    if Ti.App.Properties.getBool("stateMainTableSlide") is false
      @state = @state.moveForward()
    else
      @state = @state.moveBackward()
      
  selectMenu:(menuName) ->

    return @client.useMenu menuName

  currentPage:(pageNumber) ->
    
    return true     
  webViewContentsUpdate: (body) ->
    return webview.contentsUpdate(body)
    
  webViewHeaderUpdate: (json) ->

    return webview.headerUpdate(json)

  moveToConfigWindow: () ->
    configMenu = require("ui/configMenu")
    menu = new configMenu()
    configWindow = new win()
    configWindow.title = "アカウント情報"
    configWindow.backButtonTitle = '戻る'
    configWindow.add menu
    return tab.open(configWindow)

              
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

    
    
  errorHandle: (param) ->
    Ti.API.info @message.network.timeout
    return actInd.hide()

    
  logging:(logData) ->
    # logData の形式は以下を想定
    # {
      # source:""
      # time:
      # message:""
    # }
    newDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'log');
    newDir.createDirectory()
    if newDir is true
      logFile = Titanium.Filesystem.getFile(newDir.nativePath,'application.log')
      if logFile.exists() is false
        Ti.API.info "file create"
        logFile.createTimestamp()
        logFile.write(logData)
      else
        Ti.API.info "write data"
        logFile.write(logData.toString())
    else
      Ti.API.info "write data"
      logFile = Titanium.Filesystem.getFile(newDir.nativePath,'application.log')      
      logFile.write(logData.toString())
        
    return true
  login:(param) ->

    qiita._auth(param, (token)->
      actInd.backgroundColor = '#222'
      actInd.zIndex = 10
      actInd.show()
      if token is null
        alert "ユーザIDかパスワードが間違ってます"
      else
        alert "認証出来ました"
        Ti.App.Properties.setString('QiitaLoginID', param.url_name)
        Ti.App.Properties.setString('QiitaLoginPassword', param.password)
        
      actInd.hide()
      
    )
    
    # Ti.API.info "login success: token is #{token}"
    
    return true

                  


module.exports = qiitaController