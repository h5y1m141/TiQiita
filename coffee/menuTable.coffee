class menuTable
  constructor: () ->
    table = Ti.UI.createTableView
      backgroundColor:'#222'
      separatorStyle:0
      zIndex:1
      width:80
      left:0
      top:0

    slideEvent = ->
      Ti.App.Properties.setBool("stateMainTableSlide",true)
      # controller.slideMainTableを呼び出して
      # スライド状態から標準状態に画面を戻す
      controller.slideMainTable()
      
    table.addEventListener('click',(e) ->

      curretRowIndex = e.index
      # すべてのrowの背景色をデフォルト値に設定
      menuRows = table.data[0].rows
      for menuRow in menuRows
        if menuRow.backgroundColor isnt '#222'
          menuRow.backgroundColor = '#222'
      
      # その上でクリックされたrowの色を'#59BB0C'に設定
      table.data[0].rows[curretRowIndex].backgroundColor = '#59BB0C'
      
      # サブメニューで選択されたタグにマッチする
      # 投稿を非表示にする
      

      items = JSON.parse(Ti.App.Properties.getString('storedStocks'))
      result = []
      
      if curretRowIndex is 0
        result.push(t.createRow(json)) for json in items
      else
        for i in [0..items.length-1]
          tags = items[i].tags
          _ = require("lib/underscore-min")
          tagName = e.rowData.className

          value = _.where(tags,{"url_name":tagName})

          if value.length isnt 0
            result.push(t.createRow(items[i]))
            
      # row.classの値が allLabel の場合にのみ過去の投稿を
      # 読み込むためのラベルを配置する
      # 理由としては該当のタグにマッチする投稿情報のみ
      # 表示にした状態で loadOldEntry実行すると処理が煩雑になるため
      if table.data[0].rows[curretRowIndex].className is "allLabel"
        result.push(t.createRowForLoadOldEntry())  
      
      mainTable.setData result


    )
      
    qiita.getFollowingTags( (result,links)->
      menuRows = []
      allLabelRow = Ti.UI.createTableViewRow
        width:80
        opacity:0.8
        backgroundColor:'#59BB0C'
        selectedBackgroundColor:'#222'
        borderColor:'#ededed'
        height:60

      allLabelRow.addEventListener('click',(e)->
        slideEvent()
      )        
      allLabel = Ti.UI.createLabel
        width:80
        height:60
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
      menuRows.push allLabelRow
        
      for json in result
        menuRow = Ti.UI.createTableViewRow
          width:80
          opacity:0.8
          backgroundColor:'#222'
          selectedBackgroundColor:'#59BB0C'
          borderColor:'#ededed'
          height:60
          
        # 該当するタグが選択された時には背景色を変更しつつ
        # 標準状態に戻す
        menuRow.addEventListener('click',(e)->
          e.row.backgroundColor = '#59BB0C'
          slideEvent()
        )
        textLabel = Ti.UI.createLabel
          width:80
          height:60
          top:0
          left:0
          wordWrap:true
          color:'#fff'
          font:
            fontSize:12
            fontWeight:'bold'
          text:json.url_name
        menuRow.add textLabel
        menuRow.className = json.url_name
        menuRows.push menuRow
      
      table.setData menuRows
      
    )
    return table
    
    
module.exports = menuTable