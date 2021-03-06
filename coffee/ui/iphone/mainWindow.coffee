class mainWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f9f9f9"
      keyColor:'#59BB0C'
      textColor:"#f9f9f9"

    @window = Ti.UI.createWindow
      title:"Qiita"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:true
      navBarHidden:true
      

    @slideState = false
    @actInd = Ti.UI.createActivityIndicator
      zIndex:30
      backgroundColor:"#222"
      top:150
      left: 120
      height: 40
      width: 'auto'
      font: 
        fontFamily:'Helvetica Neue'
        fontSize:15
        fontWeight:'bold'
      color: '#fff'
      message: 'loading...'    
    menuBtn = Ti.UI.createLabel
      backgroundColor:"transparent"
      color:@baseColor.textColor
      width:80
      height:40
      top:0
      left:10
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe08e")

    menuBtn.addEventListener('click',(e) =>
      Ti.API.info @slideState
      if @slideState is true
        @resetSlide()
      else
        @slideWindow()

    ) 
    @title = Ti.UI.createLabel
      width:240
      textAlign:'center'
      left:40
      font:
        fontSize:16
      text:"Qiita:投稿一覧"
      color:@baseColor.textColor
      
    @navView = Ti.UI.createView
      width:Ti.UI.FULL
      height:40
      top:0
      left:0
      backgroundColor:@baseColor.keyColor
      # opacity:0.5      
      zIndex:25
            
    @navView.add menuBtn
    @navView.add @title
    @window.add @navView
    @actInd.hide()
    @window.add @actInd
      
  getWindow:() ->
    return @window
    
  setWindowTitle:(title) ->
    @title.text = title
    return
    
  resetSlide:() ->  
    transform = Titanium.UI.create2DMatrix()
    animation = Titanium.UI.createAnimation()
    animation.left = 0
    animation.transform = transform
    animation.duration = 250
    
    mainListView.animate(animation)
    @navView.animate(animation)
    @slideState = false
    return
  
  slideWindow:() ->    
    transform = Titanium.UI.create2DMatrix()
    animation = Titanium.UI.createAnimation()
    animation.left = 200
    
    animation.transform = transform
    animation.duration = 250
    
    mainListView.animate(animation)
    @navView.animate(animation)        
    @slideState = true
    return
        
  _createAdView:() ->
    # 画面下部に広告用のViewを配置するための高さ計算処理
    nend = require('net.nend')
    Config = require("model/loadConfig")
    config = new Config()
    nendConfig = config.getNendData()

    adView = nend.createView
      spotId:nendConfig.spotId
      apiKey:nendConfig.apiKey
      width:320
      height:50
      bottom: 0
      left:0
      zIndex:20
      
    adView.addEventListener('start',(e) ->
      
    )
    adView.addEventListener('load',(e) ->
      
    )
    adView.addEventListener('error',(e) ->
      Ti.API.info "doesn't load ad data"
    )

    return adView
    
module.exports = mainWindow  