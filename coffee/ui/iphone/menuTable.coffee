class menuTable
  constructor: () ->
    backgroundColorBase = '#222'
    @backgroundColorSub = '#333'

    @qiitaColor = '#59BB0C'
    @fontThemeWhite =
      top: 5
      left: 5
      color: "#fff"
      font:
        fontSize: 12
        fontWeight: "bold"
        
    @rowColorTheme = 
      width:255
      left:1
      opacity:0.8
      borderColor:'#ededed'
      height:40
      backgroundColor:@backgroundColorSub
      
    @menuTable = Ti.UI.createTableView
      backgroundColor:backgroundColorBase
      separatorStyle:1
      separatorColor:backgroundColorBase
      zIndex:1
      width:200
      left:0
      top:0
      
    @menuTable.addEventListener('click',(e) =>
      curretRowIndex = e.index
      className = @menuTable.data[0].rows[curretRowIndex].className
      tagName = @menuTable.data[0].rows[curretRowIndex].tagName
      accountName = @menuTable.data[0].rows[curretRowIndex].accountName
      mainController = require("controllers/mainContoroller")
      mainController = new mainController()
      
      if className is "storedStocks"
        Ti.App.Properties.setString "currentPage","storedStocks"
        MainWindow.resetSlide()
        mainController.getFeed()
      else if className is "storedMyStocks"
        Ti.App.Properties.setString "currentPage","storedMyStocks"
        MainWindow.resetSlide()
        mainController.getMyStocks()
      else if className is "followerItems"
        Ti.App.Properties.setString "currentPage","followerItems"
        MainWindow.resetSlide()
        mainController.getFollowerItems()
      else if className is "tags"
        Ti.App.Properties.setString "currentPage","followingTag#{tagName}"
        MainWindow.resetSlide()
        mainController.getFeedByTag(tagName)
      else if className is "accountSetting"

        configMenu.show(accountName)
        
        
      else if className is "noevent"
        Ti.API.info "no event fired!"
      else
        Ti.API.info "no event fired!"

    )
    rows = []
    @makeConfigRow(rows)
    rows.push(@makeAllLabelRow())
    @refreshMenu()
    @menuTable.setData rows
    
    return
    
  getMenuTable:() ->
    return @menuTable
    
  makeAllLabelRow:() ->
    allLabelRow = Ti.UI.createTableViewRow(@rowColorTheme)
    allLabelRow.backgroundColor = @backgroundColorSub

    allLabelRow.addEventListener('click',(e) =>

    )
    
    allStockBtn = Ti.UI.createImageView
      image:"ui/image/light_list.png"
      left:5
      top:8
      backgroundColor:"transparent"
    
    allLabel = Ti.UI.createLabel
      width:255
      height:40
      top:0
      left:35
      wordWrap:true
      color:'#fff'
      font:
        fontSize:12
        fontWeight:'bold'
      text:"投稿一覧"
      
      
    allLabelRow.className = "storedStocks"
    allLabelRow.add allStockBtn
    allLabelRow.add allLabel
    return allLabelRow
    
  makeConfigRow:(rows) ->
    accountInfo = [
      name:'qiita'
      iconImage:'ui/image/qiita.png'
    ,  
      name:'hatena'
      iconImage:'ui/image/hatena.png'
    ,  
      name:'twitter'
      iconImage:'ui/image/twitter.png'      
    ]
    
    baseRow = Ti.UI.createTableViewRow(@rowColorTheme)
      
    Label = Ti.UI.createLabel(@fontThemeWhite)
    Label.text = "アカウント設定"
    Label.top = 10
    Label.left = 35

    Btn = Ti.UI.createImageView
      image:"ui/image/light_gear.png"
      left:5
      top:10
      backgroundColor:"transparent"
      
    baseRow.add Label        
    baseRow.add Btn
    baseRow.className = 'noevent'
    rows.push baseRow

    for data in accountInfo
      _row = Ti.UI.createTableViewRow(@rowColorTheme)
      _row.className = 'accountSetting'
      _row.accountName = data.name
      
      profileImage = Ti.App.Properties.getString "#{data.name}ProfileImageURL"
      Ti.API.info (Ti.App.Properties.getString "hatenaProfileImageURL") 
      
      if profileImage is null

        iconImage = Ti.UI.createImageView
          width:30
          height:30
          top:5
          left:5
          image:data.iconImage
      else
        iconImage = Ti.UI.createImageView
          width:30
          height:30
          top:5
          left:5
          image:profileImage
          
      _row.add iconImage
        
      _label = Ti.UI.createLabel
        width:200
        height:40
        top:1
        left:60
        color:'#fff'
        font:
          fontSize:12
          fontWeight:'bold'
        text:data.name
      _row.add _label
      rows.push _row
      
    return  

    
  makeStockRow:() ->
    stockBtn = Ti.UI.createImageView
      image:"ui/image/light_list.png"
      left:5
      top:5
      backgroundColor:"transparent"
      
    stockLabel = Ti.UI.createLabel(@fontThemeWhite)
      
    stockLabel.text = "ストック一覧"
    stockLabel.top = 8
    stockLabel.left = 35

    stockRow = Ti.UI.createTableViewRow(@rowColorTheme)
    stockRow.addEventListener('click',(e) =>
      
    )
    stockRow.className = "storedMyStocks"
    stockRow.add stockBtn
    stockRow.add stockLabel

    return stockRow

  makeTagRow:() ->
    tagRow = Ti.UI.createTableViewRow(@rowColorTheme)
      
    tagLabel = Ti.UI.createLabel(@fontThemeWhite)
      
    tagLabel.text = "フォローしてるタグ"
    tagLabel.top = 8
    tagLabel.left = 35

    tagBtn = Ti.UI.createImageView
      image:"ui/image/light_tag.png"
      left:5
      top:10
      backgroundColor:"transparent"
      
    tagRow.add tagLabel        
    tagRow.add tagBtn
    tagRow.className = 'noevent'
    return tagRow
    
  makeFollowerItemsRow:() ->
    followerItemsBtn = Ti.UI.createImageView
      image:"ui/image/light_pegman---yes@2x.png"
      left:5
      top:5
      backgroundColor:"transparent"
      
    followerItemsLabel = Ti.UI.createLabel(@fontThemeWhite)
      
    followerItemsLabel.text = "フォロワー投稿"
    followerItemsLabel.top = 8
    followerItemsLabel.left = 35

    followerItemsRow = Ti.UI.createTableViewRow(@rowColorTheme)
    followerItemsRow.addEventListener('click',(e) =>

    )
    followerItemsRow.className = "followerItems"
    followerItemsRow.add followerItemsBtn
    followerItemsRow.add followerItemsLabel

    return followerItemsRow
    
      
    # すべてのrowの背景色をデフォルト値に設定
  resetBackGroundColor: (menuRows) ->
    menuRows = @menuTable.data[0].rows
    for menuRow in menuRows
      if menuRow.backgroundColor isnt @backgroundColorSub
        menuRow.backgroundColor = @backgroundColorSub

  refreshMenu:() ->
    # リフレッシュするために、既存のメニューを初期化
    resetRows = []
    @menuTable.setData resetRows
    that = @
    Qiita = require("model/qiita")
    qiita = new Qiita()
    param =
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')

    qiita._auth(param, (token)->
      Ti.API.debug "token is #{token}"
      if token is null
        Ti.API.info "ユーザIDかパスワードが間違ってます"
        
      else
      
        qiita.getFollowingTags( (result,links)=>
          rows = []
          if result.length is 0
            that.makeConfigRow(rows)
            rows.push that.makeAllLabelRow()
            rows.push that.makeStockRow()
            
          else
            that.makeConfigRow(rows)
            rows.push that.makeAllLabelRow()
            rows.push that.makeStockRow()
            rows.push that.makeFollowerItemsRow() 
            rows.push that.makeTagRow()

            for json in result
              Ti.App.Properties.setString "followingTag#{json.url_name}nextURL", null
              menuRow = Ti.UI.createTableViewRow(that.rowColorTheme)

              # c++のようなタグの場合、url_nameを参照するとHTMLエンコード
              # されている表記になってしまうためラベルの表示にはname
              # プロパティを設定しclassNameはQiitaAPI呼び出す時の処理で
              # url_name利用したほうが都合良いためそちらを参照
              textLabel = Ti.UI.createLabel
                width:255
                height:40
                top:1
                left:20
                wordWrap:true
                color:'#fff'
                font:
                  fontSize:12
                  fontWeight:'bold'
                text:json.name
              menuRow.add textLabel
              menuRow.className = "tags"
              menuRow.tagName = "#{json.url_name}"
              rows.push menuRow
              
            


          that.menuTable.setData rows
        )    
    )        
    
module.exports = menuTable