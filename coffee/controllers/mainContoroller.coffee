class mainContoroller
  constructor:() ->
    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
      
  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'


    if controller.networkStatus() is false
      @._alertViewShow @networkDisconnectedMessage
    else if loginID is null or password is null

      ConfigMenu = require("ui/configMenu")
      configMenu = new ConfigMenu()
      configWindow = new win()
      configWindow.title = "アカウント情報"
      configWindow.backButtonTitle = '戻る'
      configWindow.add configMenu
      tab.window = configWindow
      tabGroup.open()
      
    else
      # direction = "horizontal"

      @.createMainWindow()
      @.refreshMenuTable()

      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',false
      controller.slideMainTable(direction)
      
      commandController.useMenu "storedStocks"

      
    return true

  networkConnectionCheck:(callback) ->

    if controller.networkStatus() is false
      @._alertViewShow @networkDisconnectedMessage
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "mainContoroller.networkConnectionCheck #{currentPage}"
      return controller.slideMainTable(direction)
    else
      return callback()
      
  authenticationCheck:(callback)->
    token = Ti.App.Properties.getString 'QiitaToken'
    if token is null
      @._alertViewShow @authenticationFailMessage
    else
      return callback()
    
  _alertViewShow:(messsage) ->
    alertView.editMessage messsage
    alertView.animate()
    
  createMainWindow:() ->
    listBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
      
    listBtn.addEventListener('click',()->
      direction = "horizontal"
      controller.slideMainTable(direction)
    )
    
    refreshBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
      
    refreshBtn.addEventListener('click',()->
      mainContoroller.networkConnectionCheck(()->
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
    
    tabGroup.open()
    
  refreshMenuTable:() ->
    # Ti.API.info menuTable

    return menuTable.refreshMenu()

module.exports = mainContoroller  