class configMenu
  constructor: () ->
    @baseColor =
      backgroundColor:"#f9f9f9"
      barBackgroundColor:"#222"
      keyColor:'#4BA503'
      textColor:"#f9f9f9"    

    @QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
    @QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')
    qiitaAccountSection = @_createQiitaAccountSection()
    socialAccountSection = @_createSocialAccountSection()
    
    view = Ti.UI.createView
      width:200
      height:Ti.Platform.displayCaps.platformHeight
      backgroundColor:@baseColor.backgroundColor
      top:0
      left:0
    
    view.add qiitaAccountSection
    view.add socialAccountSection
    
    return view


  _createQiitaAccountSection:() ->
    _view = Ti.UI.createView
      width:200
      height:200
      top:10
      left:0
      backgroundColor:@baseColor.backgroundColor
      zIndex:20
    textField1 = Ti.UI.createTextField
      color:"#222"
      top:5
      left:10
      width:180
      height:30
      hintText:"QiitaユーザID"
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
    
    textField2 = Ti.UI.createTextField
      color:"#222"
      top:50
      left:10
      width:180
      height:30
      hintText:"パスワード入力"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_ASCII
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      enableReturnKey:true
      passwordMask:true
      autocorrect:false
      
    textField2.addEventListener('change',(e) ->
      Ti.App.Properties.setString('QiitaLoginPassword',e.value)
    )
    
    if QiitaLoginID isnt null
      textField1.value = QiitaLoginID

    if QiitaLoginPassword isnt null
      textField2.value = QiitaLoginPassword
      
    loginBtn = Ti.UI.createLabel
      width:120
      height:40
      top:100
      left:10
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.textColor
      backgroundColor:"#4cda64"
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
      text:"ログインする"
      textAlign:'center'
    
    loginBtn.addEventListener('click',(e) ->
      mainController = require("controllers/mainContoroller")
      mainController = new mainController()
      textField2.enabled = false
      return mainController.qiitaLogin()
            
    )

    _view.add textField1
    _view.add textField2
    _view.add loginBtn
    
    return _view

    
  _createSocialAccountSection:() ->
    _view = Ti.UI.createView
      width:Ti.UI.FULL
      height:180
      top:200
      left:0
      backgroundColor:@baseColor.backgroundColor
      zIndex:20
    hatenaIconImage = Ti.UI.createImageView
      width:35
      height:35
      top:5
      left:5
      image:"ui/image/hatena.png"
      
    if Ti.App.Properties.getBool("hatenaAccessTokenKey")?
      hatenaSwitch = Ti.UI.createSwitch
        left:50
        top:5
        value:true

    else
      hatenaSwitch = Ti.UI.createSwitch
        top:5
        left:50
        value:false

      
    
    hatenaSwitch.addEventListener("change", (e) ->
      if e.value is true

        Hatena = require("model/hatena")
        hatena = new Hatena()
        hatena.login()
      else
        Ti.App.Properties.removeProperty("hatenaAccessTokenKey")
        Ti.App.Properties.removeProperty("hatenaAccessTokenSecret")
    )
         
    _view.add hatenaIconImage
    _view.add hatenaSwitch
    
    return _view


module.exports = configMenu