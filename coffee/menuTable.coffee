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
        
      stockLabel.text = "ストック投稿を見る"
      stockLabel.top = 8
      stockLabel.left = 35

      stockRow = Ti.UI.createTableViewRow(rowColorTheme)
      stockRow.addEventListener('click',(e) ->
        slideEvent()
      )
      stockRow.className = "stock"
      stockRow.add stockBtn
      stockRow.add stockLabel

      return stockRow

    makeTagRow = ->
      tagRow = Ti.UI.createTableViewRow(rowColorTheme)
        
      tagLabel = Ti.UI.createLabel(fontThemeWhite)
        
      tagLabel.text = "タグを見る"
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

            
    matchTag = (items,tagName) ->
      for i in [0..items.length-1]
        tags = items[i].tags
        _ = require("lib/underscore-min")

        value = _.where(tags,{"url_name":tagName})

        if value.length isnt 0
          return t.createRow(items[i])

    slideEvent = ->
      Ti.App.Properties.setBool("stateMainTableSlide",true)
      # controller.slideMainTableを呼び出して
      # スライド状態から標準状態に画面を戻す
      controller.slideMainTable()
      
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

      items = JSON.parse(Ti.App.Properties.getString('storedStocks'))
      result = []

      configIndexPosition   = 0
      stockIndexPosition    = 1
      allLabelIndexPosition = 3
      
      switch table.data[0].rows[curretRowIndex].className
        when "config"
          Ti.API.info "CONDITION CONFIG"
          configTableRow = require("configTableRow")
          configRow = new configTableRow
          result = configRow
        when "stock"
          Ti.API.info "CONDITION STOCK"
          result.push(t.createRow(json)) for json in items
        when "allLabel"
          Ti.API.info "CONDITION ALL"
          result.push(t.createRow(json)) for json in items
          # row.classの値が allLabel の場合にのみ過去の投稿を
          # 読み込むためのラベルを配置する
          # 理由としては該当のタグにマッチする投稿情報のみ
          # 表示にした状態で loadOldEntry実行すると処理が煩雑になるため
          result.push(t.createRowForLoadOldEntry())
        else
          tagName = e.rowData.className
          result.push(matchTag(items,tagName))
      

            
      

          
      
      mainTable.setData result
    )
      
    qiita.getFollowingTags( (result,links)->
      rows = [makeConfigRow(),makeStockRow(),makeTagRow()]
      
      allLabelRow = Ti.UI.createTableViewRow(rowColorTheme)
      allLabelRow.backgroundColor = qiitaColor
      allLabelRow.selectedBackgroundColor = backgroundColorSub

      allLabelRow.addEventListener('click',(e)->
        slideEvent()
      )        
      allLabel = Ti.UI.createLabel
        width:158
        height:40
        top:0
        left:0
        wordWrap:true
        color:'#fff'
        font:
          fontSize:12
          fontWeight:'bold'
        text:"ALL"
        
      allLabelRow.className = "allLabel"
      allLabelRow.add allLabel
      
      rows.push allLabelRow
  
        
      for json in result
        menuRow = Ti.UI.createTableViewRow(rowColorTheme)
          
        # 該当するタグが選択された時には背景色を変更しつつ
        # 標準状態に戻す
        menuRow.addEventListener('click',(e)->
          e.row.backgroundColor = qiitaColor
          slideEvent()
        )
        textLabel = Ti.UI.createLabel
          width:150
          height:40
          top:1
          left:0
          wordWrap:true
          color:'#fff'
          font:
            fontSize:12
            fontWeight:'bold'
          text:json.url_name
        menuRow.add textLabel
        menuRow.className = json.url_name
        
        rows.push menuRow
      
      table.setData rows
      
    )
    return table
    
    
module.exports = menuTable