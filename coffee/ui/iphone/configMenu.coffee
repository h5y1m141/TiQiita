class configMenu
  constructor: () ->
    @baseColor =
      backgroundColor:"#f9f9f9"
      barBackgroundColor:"#222"
      keyColor:'#4BA503'
      textColor:"#f9f9f9"    

    @QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
    @QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')
    
    t = Titanium.UI.create2DMatrix().scale(0.0)    
    @view = Ti.UI.createView
      width:200
      height:200
      backgroundColor:@baseColor.backgroundColor
      top:80
      left:0
      zIndex:10
      transform:t
      
    qiitaAccountSection = @_createQiitaAccountSection()
    @view.add qiitaAccountSection
    

  getMenu:() ->
    return @view

  show:(accountName) ->

    if accountName is 'qiita'
      t1 = Titanium.UI.create2DMatrix()
      t1 = t1.scale(1.0)
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 250
      return @view.animate(animation)
      
    else if accountName is 'hatena'
      Hatena = require("model/hatena")
      hatena = new Hatena()
      return hatena.login()    

    else if accountName is 'twitter'
      Twitter = require("model/twitter")
      twitter = new Twitter()
      return twitter.login()
    else
      Ti.API.info 'no action'
    
      
    
  hide:() ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return @view.animate(animation)
    
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
      width:80
      height:40
      top:100
      right:10
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.textColor
      backgroundColor:"#4cda64"
      font:
        fontSize:14
      text:"ログイン"
      textAlign:'center'
    
    loginBtn.addEventListener('click',(e) ->
      mainController = require("controllers/mainContoroller")
      mainController = new mainController()
      textField2.enabled = false
      return mainController.qiitaLogin()
            
    )
    cancelBtn = Ti.UI.createLabel
      width:80
      height:40
      top:100
      left:10
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.textColor
      backgroundColor:"#d8514b"
      font:
        fontSize:14
      text:"キャンセル"
      textAlign:'center'
    
    cancelBtn.addEventListener('click',(e) =>
      Ti.API.info @
      return @hide()
            
    )

    _view.add textField1
    _view.add textField2
    _view.add loginBtn
    _view.add cancelBtn
    
    return _view

    
  _createSocialAccountSection:() ->
    _view = Ti.UI.createView
      width:200
      height:180
      top:0
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