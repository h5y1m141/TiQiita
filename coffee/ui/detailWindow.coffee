class detailWindow
  constructor:(data) ->
    filterView = require("net.uchidak.tigfview")
    @baseColor =
      barColor:'#4BA503'
      backgroundColor:"#f3f3f3"
      textColor:"#f9f9f9"
      feedbackColor:'#4BA503'
      separatorColor:'#cccccc'

    @detailWindow = Ti.UI.createWindow
      left:0
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden: false
      tabBarHidden: false
      
    # Qiita へのストックやはてブする時に必要となるTokenと
    # uuid，URLを設定 
    @hatenaAccessTokenKey  = Ti.App.Properties.getString("hatenaAccessTokenKey")
    @QiitaToken = Ti.App.Properties.getString('QiitaToken')
    @uuid = data.uuid
    @url  = data.url        
    # NavBar要素を生成
    @_createNavBar(data.title)    

    # 投稿情報を表示するためWebViewを活用
    qiitaCSS = 'ui/css/qiitaColor.css'
    htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='#{qiitaCSS}' type='text/css'></link></head>"
    
    screenHeight = Ti.Platform.displayCaps.platformHeight
    adViewHeight = 55
    webViewHeight = screenHeight - adViewHeight

    @webView = Ti.UI.createWebView
      top:0
      left:0
      zIndex:5
      width:320
      height:webViewHeight
      html:"#{htmlHeaderElement}#{data.body}</body></html>"
      
      
    @dialog          = @_createDialog()
    adView          = @_createAdView()
    

    @detailWindow.add @webView
    @detailWindow.add adView
    @detailWindow.add @dialog
    
    return @detailWindow

    
  _createDialog:() ->

    t = Titanium.UI.create2DMatrix().scale(0.0)
    selectedValue = false
    qiitaPostFlg = false
    hatenaPostFlg = false
        
    _view = Ti.UI.createView
      width:300
      height:280
      top:10
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:"#333"      
      zIndex:20
      transform:t
    
        
    contents = ""

    textArea = Titanium.UI.createTextArea
      value:''
      height:100
      width:280
      top:100
      left:10
      textAlign:'left'
      borderWidth:2
      borderColor:"#dfdfdf"
      borderRadius:5
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT
      
    hintLabel = Ti.UI.createLabel
      text :"(任意)はてブ時登録時のコメント"
      font:
        fontSize:12
        fontFamily :'Rounded M+ 1p'
      color:"222"
      top:5
      left:7
      widht:100
      height:20
      backgroundColor: 'transparent'
      touchEnabled: true


    textCounter =Ti.UI.createLabel
      text :"0文字"
      font:
        fontSize:16
        fontFamily :'Rounded M+ 1p'
      color:'#4BA503'
      bottom:5
      right:5
      widht:50
      height:20
      backgroundColor: 'transparent'
    
    hintLabel.addEventListener('click',(e) ->
      return textArea.focus()
    )

    textArea.add hintLabel
    textArea.add textCounter

    if textArea.value.length > 0
      hintLabel.hide()
    
    # 入力完了後、キーボードを消す  
    textArea.addEventListener('return',(e)->
      contents = e.value
      Ti.API.info "登録しようとしてる情報は is #{contents}です"
      textArea.blur()
    )
    
    textArea.addEventListener('blur',(e)->
      contents = e.value
      Ti.API.info "blur event fire.content is #{contents}です"
    )  
    textArea.addEventListener('change',(e)=>
      # 文字入力されるたびに、文字数カウンターの値を変更する
      Ti.API.info "e.value.length is #{e.value.length}"
      textCounter.text = "#{e.value.length}文字"
      if e.value.length > 0
        hintLabel.hide()
        if e.value.length > 100
          textCounter.backgroundColor = "#d8514b"
          textCounter.color = "#f9f9f9"
        else
          textCounter.backgroundColor = 'transparent'
          textCounter.color = '#4BA503'
          
      else  
        hintLabel.show()
    )
    
    registMemoBtn = Ti.UI.createLabel
      bottom:10
      right:20
      width:120
      height:40
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:"#f9f9f9"
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"登録する"
      textAlign:'center'
    
    registMemoBtn.addEventListener('click',(e) =>
      that = @
      that._setDefaultWebViewStyle()
      Ti.API.info qiitaPostFlg
      Ti.API.info hatenaPostFlg
      if qiitaPostFlg is true
        mainContoroller.stockItemToQiita(@uuid)
      else
        Ti.API.info 'no stockItemToQiita'
        
      if hatenaPostFlg is true
        mainContoroller.stockItemToHatena(@url,contents)
      else
        Ti.API.info 'no stockItemToHatena'

      
    ) 
    cancelleBtn =  Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:10
      borderRadius:5
      backgroundColor:"#d8514b"
      color:"#f9f9f9"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      @_setDefaultWebViewStyle()
      @_hideDialog(_view,Ti.API.info "done")
    )
    
    qiitaIcon = Ti.UI.createImageView
      image:"ui/image/logo-square.png"
      top:10
      left:10
      width:35
      height:35
      
    if @QiitaToken? is true
      qiitaPostFlg = true
    else
      qiitaPostFlg = false
      
    qiitaPostSwitch = Ti.UI.createSwitch
      value:qiitaPostFlg
      top:15
      left:200
      
    qiitaPostSwitch.addEventListener('change',(e)  ->
      qiitaPostFlg = e.source.value
    )
    qiitaPostLabel = Ti.UI.createLabel
      text :"Qiitaへストック"
      textAlign:'left'
      font:
        fontSize:16
        fontFamily :'Rounded M+ 1p'
      color:"#f9f9f9"
      top:20
      left:50
      widht:100
      height:20
      backgroundColor: 'transparent'
        
    hatenaIcon = Ti.UI.createImageView
      image:"ui/image/hatena.png"
      top:50
      left:10
      width:35
      height:35
      
    if @hatenaAccessTokenKey? is true
      hatenaPostFlg = true
    else  
      hatenaPostFlg = false
      
    hatenaPostSwitch = Ti.UI.createSwitch
      value:hatenaPostFlg
      top:55
      left:200
    hatenaPostSwitch.addEventListener('change',(e) ->
      hatenaPostFlg = e.source.value
    )      
    hatenaPostLabel = Ti.UI.createLabel
      text :"はてブする"
      textAlign:'left'
      font:
        fontSize:16
        fontFamily :'Rounded M+ 1p'
      color:"#f9f9f9"
      top:60
      left:50
      widht:100
      height:20
      backgroundColor: 'transparent'
    
    _view.add qiitaIcon
    _view.add qiitaPostSwitch
    _view.add qiitaPostLabel
    _view.add hatenaIcon
    _view.add hatenaPostSwitch
    _view.add hatenaPostLabel
    _view.add textArea
    _view.add registMemoBtn
    _view.add cancelleBtn
    
    return _view

  _createAdView:() ->
    # 画面下部に広告用のViewを配置するための高さ計算処理
    Admob = require("ti.admob")
    adView = Admob.createView
      width             :320
      height            :55
      bottom            :0
      left              :0
      zIndex            :20
      adBackgroundColor :'black',
      publisherId       :"a1516c99bf7991a"

    return adView
    

  _setTiGFviewToWevView:() ->
    @webView.rasterizationScale = 0.1
    @webView.shouldRasterize = true
    @webView.kCAFilterTrilinear= true
    return
        
  _setDefaultWebViewStyle:() ->
    @webView.rasterizationScale = 1.0
    @webView.shouldRasterize =false
    @webView.kCAFilterTrilinear= false
    return

  # 引数に取ったviewに対してせり出すようにするアニメーションを適用
  _showDialog:(_view) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(1.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return _view.animate(animation)
    
  # 引数に取ったviewに対してズームインするようなアニメーションを適用
  # することで非表示のように見せる
  _hideDialog:(_view,callback) ->        
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    _view.animate(animation)
    
    animation.addEventListener('complete',(e) ->
      return callback
    )

  _createNavBar:(title) ->      
    
    menuBtn = Ti.UI.createLabel
      backgroundColor:"transparent"
      color:@baseColor.textColor
      width:28
      height:28
      right:5
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe08e")
      
    menuBtn.addEventListener('click',(e) =>
      @_setTiGFviewToWevView()
      @_showDialog(@dialog)
    )

    backBtn = Ti.UI.createLabel
      backgroundColor:"transparent"
      color:@baseColor.textColor
      width:28
      height:28
      right:5
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe080")
    
    listWindowTitle = Ti.UI.createLabel
      textAlign: 'left'
      color:@baseColor.textColor
      font:
        fontSize:14
        # fontFamily : 'Rounded M+ 1p'
      text:title

    @detailWindow.setTitleControl listWindowTitle
    @detailWindow.rightNavButton = menuBtn

      
    
module.exports  = detailWindow