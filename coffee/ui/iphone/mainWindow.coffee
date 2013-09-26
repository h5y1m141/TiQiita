class mainWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f9f9f9"
      keyColor:'#59BB0C'
      textColor:"#333"
      contentsColor:"#666"      
      grayTextColor:"#999"
    @window = Ti.UI.createWindow
      title:"Qiita"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:true
      navBarHidden:true
      

    @slideState = false
    
    menuBtn = Ti.UI.createLabel
      backgroundColor:"transparent"
      color:"#f9f9f9"
      width:40
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
    
    @navView = Ti.UI.createView
      width:Ti.UI.FULL
      height:40
      top:0
      left:0
      backgroundColor:@baseColor.keyColor
      # opacity:0.5      
      zIndex:25
            
    @navView.add menuBtn
    @window.add @navView
      
  getWindow:() ->
    return @window
      
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