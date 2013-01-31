class menuTable
  constructor: () ->
    backgroundColorBase = '#222'
    backgroundColorSub = '#333'
    backgroundColorForTags = '#444'
    qiitaColor = '#59BB0C'
    fontThemeWhite =
      top: 5
      left: 5
      color: "#fff"
      font:
        fontSize: 12
        fontWeight: "bold"
        
    rowColorTheme = 
      width:158
      left:1
      opacity:0.8
      borderColor:'#ededed'
      height:40
      backgroundColor:backgroundColorSub
      selectedBackgroundColor:qiitaColor
    
    table = Ti.UI.createTableView
      backgroundColor:backgroundColorBase
      separatorStyle:1
      separatorColor:backgroundColorBase
      zIndex:1
      width:160
      left:0
      top:0

    makeConfigRow = ->
      configBtn = Ti.UI.createImageView
        image:"ui/image/light_gear.png"
        left:5
        top:5
        backgroundColor:"transparent"
        
      configAccountLabel = Ti.UI.createLabel(fontThemeWhite)
        
      configAccountLabel.text = "アカウント設定"
      configAccountLabel.top = 8
      configAccountLabel.left = 35

      configRow = Ti.UI.createTableViewRow(rowColorTheme)
        
      configRow.addEventListener('click',(e) ->
        slideEvent()
      )
    
      configRow.className = "config"
      configRow.add configBtn
      configRow.add configAccountLabel
      return configRow

    makeStockRow = ->
      stockBtn = Ti.UI.createImageView
        image:"ui/image/light_list.png"
        left:5
        top:5
        backgroundColor:"transparent"
        
      stockLabel = Ti.UI.createLabel(fontThemeWhite)
        
      stockLabel.text = "ストック一覧"
      stockLabel.top = 8
      stockLabel.left = 35

      stockRow = Ti.UI.createTableViewRow(rowColorTheme)
      stockRow.addEventListener('click',(e) ->
        slideEvent()
      )
      stockRow.className = "storedMyStocks"
      stockRow.add stockBtn
      stockRow.add stockLabel

      return stockRow

    makeTagRow = ->
      tagRow = Ti.UI.createTableViewRow(rowColorTheme)
        
      tagLabel = Ti.UI.createLabel(fontThemeWhite)
        
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

    # 取得されてる投稿情報の中で、引数に指定したタグにマッチするもの
    # だけ抽出してrowを生成
    matchTag = (items,tagName) ->

      for i in [0..items.length-1]
        tags = items[i].tags
        _ = require("lib/underscore-min")

        value = _.where(tags,{"name":tagName})
        Ti.API.info "tags is #{tags} matchTag .tagName is #{tagName} value is #{value}"
        

        if value.length isnt 0
          return t.createRow(items[i])

    slideEvent = (currentMenu) ->
        
      Ti.App.Properties.setBool("stateMainTableSlide",true)
      # controller.slideMainTableを呼び出して
      # スライド状態から標準状態に画面を戻す
      direction = "horizontal"
      controller.slideMainTable(direction)
      
    # すべてのrowの背景色をデフォルト値に設定
    resetBackGroundColor = (menuRows) ->
      menuRows = table.data[0].rows
      for menuRow in menuRows
        if menuRow.backgroundColor isnt backgroundColorSub
          menuRow.backgroundColor = backgroundColorSub
      
      
    table.addEventListener('click',(e) ->
      curretRowIndex = e.index
      resetBackGroundColor(table.data[0].rows)
      # クリックされたrowの色を'#59BB0C'に設定
      table.data[0].rows[curretRowIndex].backgroundColor = qiitaColor
      Ti.API.info "select menu event fire. #{table.data[0].rows[curretRowIndex].className}"
      controller.selectMenu table.data[0].rows[curretRowIndex].className
    )
      
    qiita.getFollowingTags( (result,links)->

      
      
      allLabelRow = Ti.UI.createTableViewRow(rowColorTheme)
      allLabelRow.backgroundColor = qiitaColor
      allLabelRow.selectedBackgroundColor = backgroundColorSub

      allLabelRow.addEventListener('click',(e)->
        slideEvent()
      )
      
      allStockBtn = Ti.UI.createImageView
        image:"ui/image/light_list.png"
        left:5
        top:8
        backgroundColor:"transparent"
      
      allLabel = Ti.UI.createLabel
        width:158
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
      
      rows = [allLabelRow,  makeStockRow(), makeTagRow()]
      # 自分がフォローしてるタグ一覧をTi.App.PropertiesSetList followinTags
      # としてセットするために以下配列に取得するタグ名を格納
      followinTags = []  
      for json in result
        menuRow = Ti.UI.createTableViewRow(rowColorTheme)
        followinTags.push(json.url_name)       
        
        # 該当するタグが選択された時には背景色を変更しつつ
        # 標準状態に戻す
        menuRow.addEventListener('click',(e)->
          e.row.backgroundColor = qiitaColor
          slideEvent()
        )
        # c++のようなタグの場合、url_nameを参照するとHTMLエンコード
        # されている表記になってしまうためラベルの表示にはname
        # プロパティを設定しclassNameはQiitaAPI呼び出す時の処理で
        # url_name利用したほうが都合良いためそちらを参照
        textLabel = Ti.UI.createLabel
          width:150
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
        menuRow.className = "followinTag#{json.url_name}"
        rows.push menuRow
        

      rows.push makeConfigRow()
      table.setData rows
      
    )
    return table
    
    
module.exports = menuTable