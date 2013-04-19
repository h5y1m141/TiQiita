class webView
  constructor: () ->
    @webViewHeaderContainer = Ti.UI.createLabel
      top:0
      left:0
      width:320
      height:80
      backgroundColor:'#141414'

    # file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'ui/css/bootstrap.min.css')
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'ui/css/qiita.css')
    @css = file.read();
    qiitaCSS = 'ui/css/qiitaColor.css'
    bootstrapCSS ='ui/css/bootstrap.min.css'
    @htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='#{qiitaCSS}' type='text/css'></link></head>"

    @web = Ti.UI.createWebView
      top:80
      left:0
      zIndex:5
      width:320
      html:"init"
      
    @titleLabel = Ti.UI.createLabel
      font:
        fontWeight:'bold'
        fontSize:16
      color:'#fff'
      top:10
      left:80
      width:220
      height:50
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
      text : "no date"
    @iconIamge = Ti.UI.createImageView
      left:5
      top:10
      borderWidth:1
      borderColor:'#222'
      borderRadius:5
      width:50
      height:50
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
    # @webViewHeaderContainer.add(@iconIamge)
    @webViewHeaderContainer.add(@titleLabel)
    @webViewHeaderContainer.add(@dateLabel)
    
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