class qiitaController
  constructor: () ->
    @state = new defaultState()

    
  loadEntry: () ->

    currentPage = Ti.App.Properties.getString "currentPage"
    Ti.API.info "qiitaController.loadEntry start. currentPage is #{currentPage}"
    # 現在ページのパラメータを引数に該当キャッシュをクリアーして
    # 該当コマンド実行することで再度QiitaAPIにアクセス可能になる

    Ti.App.Properties.setString currentPage, null
    items = JSON.parse(Ti.App.Properties.getString(currentPage))

    direction = "vertical"
    @.slideMainTable(direction)
    commandController.useMenu currentPage

    
  loadOldEntry: (storedTo) ->

    MAXITEMCOUNT = 20
    currentPage = Ti.App.Properties.getString "currentPage"
    nextURL = Ti.App.Properties.getString "#{currentPage}nextURL"
    direction = "vertical"
    @.slideMainTable(direction)

    Ti.API.info nextURL
    
    if nextURL isnt null
      qiita.getNextFeed(nextURL,storedTo,(result) ->
        Ti.API.info "getNextFeed start. result is #{result.length}"

        # ここで投稿件数をチェックして、20件以下だったら過去のを
        # 読み込むrowを非表示にすればOK
        if result.length isnt MAXITEMCOUNT
          Ti.API.info "loadOldEntry hide"
          mainTableView.hideLastRow()
        else
          Ti.API.info "loadOldEntry show"
          for json in result
            r = mainTableView.createRow(json)
            lastIndex = mainTableView.lastRowIndex()
            mainTableView.insertRow(lastIndex,r)
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
  
  slideMainTable: (direction) ->
    slideState = Ti.App.Properties.getBool("stateMainTableSlide") 
    Ti.API.info "direction is #{direction}.slideState is #{slideState}"
    if slideState is false and direction is "horizontal"
      @state = @state.moveForward()
    else if slideState is true and direction is "horizontal"
      @state = @state.moveBackward()
    else if slideState is false and direction is "vertical"
      @state = @state.moveDown()
    else if slideState is true and direction is "vertical"
      @state = @state.moveUP()
    else
      return 
  selectMenu:(menuName) ->
    Ti.API.info "qiitaController.selectMenu start. menuName is #{menuName}"
    return commandController.useMenu menuName


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
    currentPage = Ti.App.Properties.getString "currentPage"
    Ti.API.info "moveToConfigWindow start currentPage is #{currentPage}"
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
    return mainTab.open(webWindow)

    
    
  errorHandle: (param) ->
    alertView.editMessage errorMessage
    alertView.animate()

    
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
      if token is null
        alert "ユーザIDかパスワードが間違ってます"
      else
        alert "認証出来ました"
        Ti.App.Properties.setString('QiitaLoginID', param.url_name)
        Ti.App.Properties.setString('QiitaLoginPassword', param.password)
      
    )
    
    
    return true
    
  loginFail:(errorMessage) ->
    direction = "horizontal"
    Ti.App.Properties.setBool 'stateMainTableSlide',false
    @.slideMainTable(direction)
    
    alertView.editMessage "ログイン失敗。Qiitaサーバからのエラーメッセージ:#{errorMessage}"
    alertView.animate()
    # direction = "vertical"
    # Ti.App.Properties.setBool 'stateMainTableSlide',false
    # @.slideMainTable(direction)
    
        
  networkStatus:() ->
    return qiita.isConnected()


module.exports = qiitaController