class mainContoroller
  constructor:() ->
    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
      
  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'


    if controller.networkStatus() is false
      Ti.API.info "mainContoroller init fail because of network connection not established"
      @createMainWindow()
      @createConfigWindow()
      @_alertViewShow @networkDisconnectedMessage
      tabGroup.setActiveTab(0)
      tabGroup.open()

    else if loginID is null or password is null or loginID is "" or password is ""
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

    if controller.networkStatus() is false
      @_alertViewShow @networkDisconnectedMessage
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "networkConnectionCheck #{currentPage}"
      return controller.slideMainTable(direction)
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
      
    listBtn.addEventListener('click',()->
      direction = "horizontal"
      controller.slideMainTable(direction)
    )
    
    refreshBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
      
    refreshBtn.addEventListener('click',()=>
      @.networkConnectionCheck(()->
        controller.loadEntry()
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
    controller.slideMainTable(direction)

    commandController.useMenu "storedStocks"
    commandController.useMenu "followingTags"


    
  refreshMenuTable:() ->
    return menuTable.refreshMenu()

module.exports = mainContoroller  