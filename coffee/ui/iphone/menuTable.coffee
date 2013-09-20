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
      MainWindow.resetSlide()
      curretRowIndex = e.index
      tagName = @menuTable.data[0].rows[curretRowIndex].className
      mainController = require("controllers/mainContoroller")
      mainController = new mainController()
      return mainController.getFeedByTag(tagName)

    )
    
    rows = [@makeAllLabelRow()]
    @refreshMenu()

    @menuTable.setData rows

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
        alert "ユーザIDかパスワードが間違ってます"
      else

      
        qiita.getFollowingTags( (result,links)=>
          if result.length is 0
            rows = [that.makeAllLabelRow(),  that.makeStockRow()]
          else
            rows = [that.makeAllLabelRow(),  that.makeStockRow(), that.makeFollowerItemsRow(),that.makeTagRow()]
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
              menuRow.className = "#{json.url_name}"
              rows.push menuRow

          that.menuTable.setData rows
        )    
    )        
    
module.exports = menuTable