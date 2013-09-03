class detailWindow
  constructor:(data) ->
    filterView = require("net.uchidak.tigfview")    
    @baseColor =
      barColor:'#4BA503'
      backgroundColor:"#f3f3f3"
      textColor:"#333"
      feedbackColor:'#4BA503'
      separatorColor:'#cccccc'
    
    detailWindow = Ti.UI.createWindow
      title:'投稿情報詳細画面'
      left:320
      barColor:@baseColor.barColor
      navBarHidden: false
      tabBarHidden: false
      
    qiitaCSS = 'ui/css/qiitaColor.css'
    htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='#{qiitaCSS}' type='text/css'></link></head>"
    
    screenHeight = Ti.Platform.displayCaps.platformHeight
    adViewHeight = 55
    webViewHeaderHight = 55
    webViewTopPosition = webViewHeaderHight
    webViewHeight = screenHeight - (webViewHeaderHight + adViewHeight)

    @webView = Ti.UI.createWebView
      top:55
      left:0
      zIndex:5
      width:320
      height:webViewHeight
      html:"#{htmlHeaderElement}#{data.body}</body></html>"
      
      
    @dialog          = @_createDialog()
    adView          = @_createAdView()
    headerContainer = @_createHeader(data)
    showDialogBtn = Ti.UI.createButton()
    showDialogBtn.addEventListener('click',(e)=>
      @_setTiGFviewToWevView()
      @_showDialog(@dialog)

    )
    detailWindow.rightNavButton = showDialogBtn
    detailWindow.add @webView
    detailWindow.add adView
    detailWindow.add headerContainer
    detailWindow.add @dialog
    
    return detailWindow

    
  _createDialog:() ->

    t = Titanium.UI.create2DMatrix().scale(0.0)
    unselectedColor = "#666"
    selectedColor = "#222"
    selectedValue = false
    _view = Ti.UI.createView
      width:300
      height:280
      top:60
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:"#333"      
      zIndex:20
      transform:t
    
    titleForMemo = Ti.UI.createLabel
      text: "(任意)はてブ時登録時のコメント"
      width:300
      height:40
      color:"#f9f9f9"
      left:10
      top:5
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      hintText:"(任意)はてブ時登録時のコメント"
      height:150
      width:280
      top:50
      left:10
      font:
        fontSize:12
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
      color:@baseColor.textColor
      textAlign:'left'
      borderWidth:2
      borderColor:"#dfdfdf"
      borderRadius:5
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT
      
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
    
    registMemoBtn = Ti.UI.createLabel
      bottom:30
      right:20
      width:120
      height:40
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:"f9f9f9"
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"登録する"
      textAlign:'center'

    registMemoBtn.addEventListener('click',(e) =>
      that = @
      that._setDefaultWebViewStyle()
      that.activityIndicator.show()
      # ACSにメモを登録
      # 次のCloud.Places.queryからはaddNewIconの外側にある
      # 変数参照できないはずなのでここでローカル変数として格納しておく
      
      contents = contents
      currentUserId = Ti.App.Properties.getString "currentUserId"
      Ti.API.info "contents is #{contents} and shopName is #{shopName}"
      MainController = require("controller/mainController")
      mainController = new MainController()
      mainController.sendFeedBack(contents,shopName,currentUserId,(result) =>
        that.activityIndicator.hide()
        if result.success
          alert "報告完了しました"
        else
          alert "サーバーがダウンしているために登録することができませんでした"
        that._hideDialog(_view,Ti.API.info "done")

      )
      
    ) 
    cancelleBtn =  Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:30      
      borderRadius:5
      backgroundColor:"#d8514b"
      color:"f9f9f9"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      @_setDefaultWebViewStyle()
      @_hideDialog(_view,Ti.API.info "done")
    )
    
    _view.add textArea
    _view.add titleForMemo
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
    
  _createHeader:(data) ->
    headerContainer = Ti.UI.createView
      top:0
      left:0
      width:320
      height:55
      zIndex:1
      backgroundColor:'#141414'
      
    titleLabel = Ti.UI.createLabel
      font:
        fontWeight:'bold'
        fontSize:16
      color:'#fff'
      top:5
      left:60
      width:220
      height:40
      zIndex:2
      text :data.title
      
    menuBtn = Ti.UI.createLabel
      backgroundColor:"transparent"
      color:"#f9f9f9"
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

    iconIamge = Ti.UI.createImageView
      left:5
      top:5
      borderWidth:1
      borderColor:'#222'
      borderRadius:5
      width:40
      height:40
      zIndex:20
      userName:data.user.url_name
      defaultImage:"ui/image/logo-square.png"
      backgroundColor:'#cbcbcb'
      image: data.user.profile_image_url
      
    iconIamge.addEventListener('click',(e) ->
      animation = Titanium.UI.createAnimation()
      animation.left = 320
      animation.duration = 500
      detailWindow.close(animation)
      
    )  
    headerContainer.add iconIamge
    headerContainer.add titleLabel
    headerContainer.add menuBtn
    
    return headerContainer
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
module.exports  = detailWindow