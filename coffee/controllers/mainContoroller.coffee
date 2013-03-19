class mainContoroller
  constructor:() ->
    @state = new defaultState()

    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
      
  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'
    _ = require("lib/underscore-min")

    if qiita.isConnected() is false
      Ti.API.info "mainContoroller init fail because of network connection not established"
      @_alertViewShow @networkDisconnectedMessage

    else if loginID? is false or loginID is ""
      rootWindow.open()
      rootWindow.toggleRightView()
      


    else
      Ti.API.info "start mainWindow"
      @refreshMenuTable()
      @startApp()
      Ti.App.Properties.setBool 'stateMainTableSlide',false
      rootWindow.open()

      
    return true

  networkConnectionCheck:(callback) ->

    if qiita.isConnected() is false
      @_alertViewShow @networkDisconnectedMessage
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "networkConnectionCheck #{currentPage}"
      return @slideMainTable(direction)
    else
      return callback()
      
  authenticationCheck:(callback)->
    token = Ti.App.Properties.getString 'QiitaToken'
    if token is null
      @_alertViewShow @authenticationFailMessage
    else
      return callback()
    
  _alertViewShow:(messsage) ->
    alertView.editMessage messsage
    alertView.animate()
    
  createConfigWindow:() ->
    
    configWindow.add configMenu
    configWindow.add alertView.getAlertView()
    return true
    
        

    
  startApp:() ->
    commandController.createMenu "QiitaUser"
    commandController.useMenu "storedStocks"
    
    

    
  refreshMenuTable:() ->
    return menuTable.refreshMenu()

  loadEntry: () ->
    currentPage = Ti.App.Properties.getString "currentPage"
    Ti.API.info "qiitaController.loadEntry start. currentPage is #{currentPage}"
    # 現在ページのパラメータを引数に該当キャッシュをクリアーして
    # 該当コマンド実行することで再度QiitaAPIにアクセス可能になる

    Ti.App.Properties.setString currentPage, null
    items = JSON.parse(Ti.App.Properties.getString(currentPage))

    
    commandController.useMenu currentPage

  _currentSlideState:() ->
    flg = Ti.App.Properties.getBool "stateMainTableSlide"
    if flg is true
      state = "slideState"
    else
      state = "default"

    return state

  _showStatusView:() =>
    Ti.API.info "データの読み込み。statusView表示"
    Ti.App.Properties.setBool "stateMainTableSlide",false
    return @slideMainTable("vertical")


  _hideStatusView:() =>
    Ti.API.info "データの読み込みが完了したらstatusViewを元に戻す"
    Ti.App.Properties.setBool "stateMainTableSlide",true
    return @slideMainTable("vertical")    

  loadOldEntry: (storedTo) ->

    
    @_showStatusView()

    MAXITEMCOUNT = 20
    currentPage = Ti.App.Properties.getString "currentPage"
    nextURL = Ti.App.Properties.getString "#{currentPage}nextURL"
    

    Ti.API.info nextURL
    
    if nextURL isnt null
      qiita.getNextFeed(nextURL,storedTo,(result) =>
        @_hideStatusView()
        Ti.API.info "getNextFeed start. result is #{result.length}"

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

  stockItemToQiita: (uuid) ->
    uuid = Ti.App.Properties.getString('stockUUID')
    # actInd.backgroundColor = '#222'
    # actInd.message = 'Posting...'
    # actInd.zIndex = 20
    # actInd.show()  

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
    Ti.API.info "[SLIDEMAINTABLE] direction is #{direction}.slideState is #{slideState}"

    if slideState is false and direction is "vertical"
      @state = @state.moveDown()
    else if slideState is true and direction is "vertical"
      @state = @state.moveUP()
    else
      return 
  selectMenu:(menuName) ->
    Ti.API.info "mainController.selectMenu start. menuName is #{menuName}"
    return commandController.useMenu menuName

  webViewContentsUpdate: (body) ->
    return webview.contentsUpdate(body)
    
  webViewHeaderUpdate: (json) ->
    return webview.headerUpdate(json)

  moveToWebViewWindow: () ->
    
    
    
    # actionBtn = Ti.UI.createButton
    #   systemButton: Titanium.UI.iPhone.SystemButton.ACTION

    # actionBtn.addEventListener('click',()->

    #   dialog = Ti.UI.createOptionDialog()
    #   dialog.setTitle "どの処理を実行しますか？"
    #   dialog.setOptions(["ストックする","キャンセル"])
    #   dialog.setCancel(1)
    #   dialog.addEventListener('click',(event) =>
    #     Ti.API.info "start dialog action.Event is #{event.index}"

    #     switch event.index
    #       when 0
    #         mainContoroller.stockItemToQiita()
            
    #   )
    #   dialog.show()
    # )
    
    Ti.API.info "webview show finish #{moment()}"
    Ti.API.info "#{webview.getStockUUID()}"
    navController.open webWindow
    return



module.exports = mainContoroller  