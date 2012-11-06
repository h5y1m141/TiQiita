class menuTable
  constructor: () ->
    table = Ti.UI.createTableView
      backgroundColor:'#222'
      separatorStyle:0
      zIndex:1
      width:80
      left:0
      top:0
      
    table.addEventListener('click',(e)->
      
      curretRowIndex = e.index

      Ti.API.info e.rowData.className

      # すべてのrowの背景色をデフォルト値に設定
      menuRows = table.data[0].rows
      for menuRow in menuRows
        if menuRow.backgroundColor isnt '#222'
          menuRow.backgroundColor = '#222'
      
      # その上でクリックされたrowの色を'#59BB0C'に設定
      table.data[0].rows[curretRowIndex].backgroundColor = '#59BB0C'

    )
      
    q.getFollowingTags( (result,links)->
      menuRows = []
      for json in result
        menuRow = Ti.UI.createTableViewRow
          width:80
          opacity:0.8
          backgroundColor:'#222'
          selectedBackgroundColor:'#59BB0C'
          borderColor:'#ededed'
          height:60
        menuRow.addEventListener('click',(e)->
          
          e.row.backgroundColor = '#59BB0C'
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