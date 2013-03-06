class mainContoroller
  constructor:() ->
    @state = new defaultState()
    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
      
  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'

    if qiita.isConnected() is false
      Ti.API.info "mainContoroller init fail because of network connection not established"
      @createMainWindow()
      @createConfigWindow()
      @_alertViewShow @networkDisconnectedMessage
      tabGroup.setActiveTab(0)
      tabGroup.open()

    else if loginID? is false or loginID is ""
      Ti.API.info "@createConfigWindow start"
      @createConfigWindow()
      
      tabGroup.setActiveTab(1)
      tabGroup.open()
    else
      Ti.API.info "start mainWindow"
      param =
        url_name: loginID
        password: password
        
      qiita._auth(param)

      @createConfigWindow()
      @createMainWindow()
      @refreshMenuTable()
      @startApp()
      tabGroup.setActiveTab(0)
      tabGroup.open()


      
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
    
        
  createMainWindow:() ->
    listBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
      
    listBtn.addEventListener('click',()=>
      direction = "horizontal"
      @slideMainTable(direction)
    )
    
    refreshBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
      
    refreshBtn.addEventListener('click',()=>
      @networkConnectionCheck(()=>
        @loadEntry()
      )
    )
    
    mainWindow.add actInd
    mainWindow.add mainTable
    mainWindow.add menu
    progressBar.show()
    statusView.add progressBar
    mainWindow.add statusView
    mainWindow.add alertView.getAlertView()
    mainWindow.leftNavButton  = listBtn
    mainWindow.rightNavButton  = refreshBtn
    
    return true

    
  startApp:() ->
    direction = "vertical"
    Ti.App.Properties.setBool 'stateMainTableSlide',false
    @slideMainTable(direction)

    commandController.useMenu "storedStocks"
    # commandController.useMenu "followingTags"


    
  refreshMenuTable:() ->
    return menuTable.refreshMenu()

  loadEntry: () ->
    currentPage = Ti.App.Properties.getString "currentPage"
    Ti.API.info "qiitaController.loadEntry start. currentPage is #{currentPage}"
    # 現在ページのパラメータを引数に該当キャッシュをクリアーして
    # 該当コマンド実行することで再度QiitaAPIにアクセス可能になる

    Ti.App.Properties.setString currentPage, null
    items = JSON.parse(Ti.App.Properties.getString(currentPage))

    direction = "vertical"
    @slideMainTable(direction)
    commandController.useMenu currentPage

  loadOldEntry: (storedTo) ->

    MAXITEMCOUNT = 20
    currentPage = Ti.App.Properties.getString "currentPage"
    nextURL = Ti.App.Properties.getString "#{currentPage}nextURL"
    direction = "vertical"
    @slideMainTable(direction)

    Ti.API.info nextURL
    
    if nextURL isnt null
      qiita.getNextFeed(nextURL,storedTo,(result) =>
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
        direction = "vertical"
        @slideMainTable(direction)
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
    Ti.API.info "[SLIDEMAINTABLE] direction is #{direction}.slideState is #{slideState}"
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
    Ti.API.info "mainController.selectMenu start. menuName is #{menuName}"
    return commandController.useMenu menuName


module.exports = mainContoroller  