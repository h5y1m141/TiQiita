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
      selectedBackgroundColor:@qiitaColor
    
    @menuTable = Ti.UI.createTableView
      backgroundColor:backgroundColorBase
      separatorStyle:1
      separatorColor:backgroundColorBase
      zIndex:1
      width:320
      height:'auto'
      left:0
      top:0
      
    @menuTable.addEventListener('click',(e) =>
      rootWindow.toggleLeftView()
      curretRowIndex = e.index
      @.resetBackGroundColor(@menuTable.data[0].rows)
      # クリックされたrowの色を'#59BB0C'に設定
      @menuTable.data[0].rows[curretRowIndex].backgroundColor = @qiitaColor      
      mainContoroller.selectMenu @menuTable.data[0].rows[curretRowIndex].className
    )
    
    rows = [@.makeAllLabelRow()]

    @menuTable.setData rows

    
  getMenu:() ->
    return @menuTable
    
  makeAllLabelRow:() ->
    allLabelRow = Ti.UI.createTableViewRow(@rowColorTheme)
    allLabelRow.backgroundColor = @qiitaColor
    allLabelRow.selectedBackgroundColor = @backgroundColorSub

    allLabelRow.addEventListener('click',(e) =>
      @.slideEvent(e.rowData.className)
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
    
  makeConfigRow:() ->
    configRow = Ti.UI.createTableViewRow(@rowColorTheme)    
    configBtn = Ti.UI.createImageView
      image:"ui/image/light_gear.png"
      left:5
      top:5
      backgroundColor:"transparent"
      
    configAccountLabel = Ti.UI.createLabel(@fontThemeWhite)
      
    configAccountLabel.text = "アカウント設定"
    configAccountLabel.top = 8
    configAccountLabel.left = 35


      
    configRow.addEventListener('click',(e) =>

      @.slideEvent(e.rowData.className)
    )
  
    configRow.className = "config"
    configRow.add configBtn
    configRow.add configAccountLabel
    return configRow

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
      @.slideEvent(e.rowData.className)
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

  matchTag: (items,tagName) ->
    # 取得されてる投稿情報の中で、引数に指定したタグにマッチするもの
    # だけ抽出してrowを生成

    for i in [0..items.length-1]
      tags = items[i].tags
      _ = require("lib/underscore-min")

      value = _.where(tags,{"name":tagName})
      Ti.API.info "tags is #{tags} matchTag .tagName is #{tagName} value is #{value}"

      if value.length isnt 0
        return t.createRow(items[i])

  slideEvent:(storedTo) ->
      
    Ti.App.Properties.setBool("stateMainTableSlide",true)
    Ti.App.Properties.setString("currentPage", storedTo)
    # slideMainTableを呼び出して
    # スライド状態から標準状態に画面を戻す
    direction = "horizontal"
    mainContoroller.slideMainTable(direction)
    
      
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
    
    qiita.getFollowingTags( (result,links)=>
      if result.length is 0
        rows = [@makeAllLabelRow(),  @makeStockRow()]
      else
        rows = [@makeAllLabelRow(),  @makeStockRow(), @makeTagRow()]
        for json in result
          Ti.API.info "followingTag#{json.url_name}nextURL is initiazlie!!" 
          Ti.App.Properties.setString "followingTag#{json.url_name}nextURL", null
          commandController.applyFeedByTagCommand json.url_name
          commandController.applyFeedByTagCommand json.url_name
          menuRow = Ti.UI.createTableViewRow(@rowColorTheme)
          
                    
          # 該当するタグが選択された時には背景色を変更しつつ
          # 標準状態に戻す
          menuRow.addEventListener('click',(e)=>
            e.row.backgroundColor = @qiitaColor
            @slideEvent(e.rowData.className)
          )
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
          menuRow.className = "followingTag#{json.url_name}"
          rows.push menuRow

      @menuTable.setData rows
    )    
        
    
module.exports = menuTable