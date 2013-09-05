class mainContoroller
  constructor:() ->

    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
      
  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'
    _ = require("lib/underscore-min")

    if qiita.isConnected() is false

      @_alertViewShow @networkDisconnectedMessage

    else if loginID? is false or loginID is ""
      rootWindow.toggleRightView()
      commandController.useMenu "storedStocks"


    else
      Ti.API.info "start mainWindow"
      Ti.API.info( Ti.App.Properties.getString('QiitaToken'))
      @refreshMenuTable()
      commandController.useMenu "storedStocks"

      

      
    return true

  networkConnectionCheck:(callback) ->

    if qiita.isConnected() is false
      @_alertViewShow @networkDisconnectedMessage
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "networkConnectionCheck #{currentPage}"
      return
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
    

    
  refreshMenuTable:() ->
    Ti.API.debug "refreshMenuTable"
    return menuTable.refreshMenu()

  loadEntry: () ->
    currentPage = Ti.App.Properties.getString "currentPage"
    Ti.API.info "qiitaController.loadEntry start. currentPage is #{currentPage}"
    # 現在ページのパラメータを引数に該当キャッシュをクリアーして
    # 該当コマンド実行することで再度QiitaAPIにアクセス可能になる

    Ti.App.Properties.setString currentPage, null
    items = JSON.parse(Ti.App.Properties.getString(currentPage))

    
    commandController.useMenu currentPage


  _showStatusView:() =>
    Ti.API.info "[ACTION] スライド開始"
    progressBar.value = 0
    progressBar.show()    
    statusView.animate({
        duration:400
        top:0
    },() ->
      Ti.API.debug "mainTable を上にずらす"
      mainTable.animate({
        duration:200
        top:50
      })
    )


  _hideStatusView:() =>
    Ti.API.info "[ACTION] スライドから標準状態に戻る。垂直方向"
    mainTable.animate({
      duration:200
      top:0
    },()->
      Ti.API.debug "mainTable back"
      progressBar.hide()
      statusView.animate({
        duration:400
        top:-50
      })
    )

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
    qiita.putStock(uuid)
    
    return true
  stockItemToHatena: (url,contents) ->
    Hatena = require("model/hatena")
    hatena = new Hatena()
    Ti.API.info "stockItemToQiita start. url is #{url}"
    hatena.postBookmark(url,contents)

    
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
    

    Ti.API.info "webview show finish #{moment()}"
    Ti.API.info "#{webview.getStockUUID()}"
    navController.open webWindow
    return



module.exports = mainContoroller  