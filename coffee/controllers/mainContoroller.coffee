class mainContoroller
  constructor:() ->
    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
      
  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'


    if controller.networkStatus() is false
      @_alertViewShow @networkDisconnectedMessage
    else if loginID is "" or password is ""
      @createWelcomeAppsWindow()
      
    else
      # direction = "horizontal"
      @createMainWindow()
      @refreshMenuTable()
      @startApp()

      
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
    
  createWelcomeAppsWindow:() ->
    ConfigMenu = require("ui/configMenu")
    configMenu = new ConfigMenu()
    configWindow = new win()
    configWindow.title = "アカウント情報"
    configWindow.backgroundColor = '#fff'
    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
    QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')
    
    closeBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.DONE
      
    closeBtn.addEventListener('click',()=>
      configWindow.close()
      configWindow.hide()
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
      @startApp()
      tab.open mainWindow
      
    )
    
    configWindow.rightNavButton = closeBtn
    
    backView =Titanium.UI.createView
      zIndex:5
      width: 310
      height: 250
      left:5
      top:50
      borderRadius:10
      backgroundColor:'#59BB0C'
      
    label1 = Ti.UI.createLabel
      color:"#222"
      top:5
      left:5
      width:100
      height:40
      text:"ログインID"
    
    textField1 = Ti.UI.createTextField
      color:"#222"
      top:5
      left:110
      width:150
      height:40
      hintText:"ユーザID"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_EMAIL_ADDRESS
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      autocorrect:false
      autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    
    textField1.addEventListener('change',(e) ->
      Ti.App.Properties.setString('QiitaLoginID',e.value)
    )
    

    label2 = Ti.UI.createLabel
      color:"#222"
      top:50
      left:5
      width:100
      height:40
      text:"パスワード"
    

    textField2 = Ti.UI.createTextField
      color:"#222"
      top:50
      left:110
      width:150
      height:40
      hintText:"パスワード入力"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_ASCII
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      passwordMask:true
      autocorrect:false
      
    textField2.addEventListener('change',(e) ->
      Ti.App.Properties.setString('QiitaLoginPassword',e.value)
    )

    label3 = Ti.UI.createLabel
      color:"#fff"
      top:100
      left:5
      width:300
      height:40
      textAlign:1
      font:
        fontSize:18
        fontWeight:'bold'
      text:"ログインする"
      
    label3.addEventListener('click',(e) ->
      commandController.useMenu "qiitaLogin"
    )
       
    backView.add label1
    backView.add textField1
    backView.add label2
    backView.add textField2
    backView.add label3
    
    configWindow.add backView
    tab.window = configWindow
    tabGroup.open()

    
        
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
    
    return tabGroup.open()

    
  startApp:() ->
    direction = "vertical"
    Ti.App.Properties.setBool 'stateMainTableSlide',false
    controller.slideMainTable(direction)

    commandController.useMenu "storedStocks"
    
  refreshMenuTable:() ->
    return menuTable.refreshMenu()

module.exports = mainContoroller  