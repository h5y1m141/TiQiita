class webView
  constructor: () ->
    screenHeight = Ti.Platform.displayCaps.platformHeight
    adViewHeight = 50
    webViewHeaderHight = 55
    barHeight = 60
    webViewTopPosition = webViewHeaderHight
    webViewHeight = screenHeight - (barHeight + webViewHeaderHight + adViewHeight)


    @webViewHeaderContainer = Ti.UI.createView
      top:0
      left:0
      width:320
      height:webViewHeaderHight
      zIndex:1
      backgroundColor:'#141414'


    qiitaCSS = 'ui/css/qiitaColor.css'
    # bootstrapCSS ='ui/css/bootstrap.min.css'
    @htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='#{qiitaCSS}' type='text/css'></link></head>"

    @web = Ti.UI.createWebView
      top:webViewTopPosition
      left:0
      zIndex:5
      width:320
      height:webViewHeight
      html:"init"
      
    @titleLabel = Ti.UI.createLabel
      font:
        fontWeight:'bold'
        fontSize:16
      color:'#fff'
      top:5
      left:80
      width:220
      height:40
      zIndex:2
      text :"no title"
      
    @dateLabel = Ti.UI.createLabel
      font:
        fontSize:12
      textAlign:2
      color:'#fff'
      top:65
      left:80
      width:220
      height:15
      zIndex:2
      text : "no date"
    @iconIamge = Ti.UI.createImageView
      left:5
      top:5
      borderWidth:1
      borderColor:'#222'
      borderRadius:5
      width:40
      height:40
      zIndex:20
      userName:""
      defaultImage:"ui/image/logo-square.png"
      backgroundColor:'#cbcbcb'
      image: ""
      
  
    stockURL = null
    stockUUID = null

    # @web.hide()
    
  retreiveWebView: () ->
    return @web
    
  retreiveWebViewHeader: () ->
    return @webViewHeaderContainer
    
  headerUpdate: (json) ->
    @titleLabel.text = json.title
    @dateLabel.text = '投稿日：' + moment(json.created_at,"YYYY-MM-DD HH:mm:ss Z").fromNow()
    @iconIamge.image = json.user.profile_image_url
    @iconIamge.userName = json.user.url_name
    @iconIamge.addEventListener('click',(e)->
      Ti.API.info e.source.userName
    )
    
    @webViewHeaderContainer.add(@iconIamge)
    @webViewHeaderContainer.add(@titleLabel)
    # @webViewHeaderContainer.add(@dateLabel)
    
    return true
    
  contentsUpdate:(body) ->
    @web.html = "#{@htmlHeaderElement}#{body}</body></html>"
    return true
    
  show:() ->
    return @web.show()

  setStockUUID:(stockUUID) ->
    @stockUUID = stockUUID
    return

  setStockURL:(stockURL) ->
    @stockURL = stockURL
    return

  getStockUUID:() ->
    return @stockUUID

  getStockURL:() ->
    return @stockURL


      
module.exports = webView    