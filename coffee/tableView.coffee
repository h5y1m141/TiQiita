class tableView
  constructor: () ->
    @table = Ti.UI.createTableView
      backgroundColor:'#ededed'
      separatorColor: '#999'
      zIndex:2
      width:320
      left:0
      top:0
    @table.addEventListener('click',(e)->
      # TableViewの一番下に、過去投稿を読み込むためのボタンを
      # 配置しており、そのrowだけは投稿詳細画面に遷移させない
      # 詳細画面にいくかどうかはrowのclassNameの値をチェックする
      if e.rowData.className == 'entry'
        
        # 一覧画面から詳細画面に遷移した後、該当の投稿情報を
        # ストックする際にURLやuuidの情報が必要になるために
        # sessionItem()を利用する
        controller.sessionItem e.rowData.data
        controller.makeWebView e.rowData.data
       else
        controller.loadOldEntry()
    )
    
  getTable: ()->

    return @table
  insertRow: (index,row)->
    @table.insertRowAfter(index,row,{animated:true})
    return true
  lastRowIndex: () ->
    # TableViewの行から2を引くことで最後のRowのindexを取得してるが
    # 理由は下記２点のため
    # 1.Rowの一番下にボタンとなるものを配置しているのでその分のRowを無視するためマイナス１する
    # 2.Rowの先頭は0から始まっているので、そのためにマイナス１する。

    return @table.data[0].rows.length-2
  createRow: (json) ->
    row = Ti.UI.createTableViewRow
      width:320
      borderWidth:2
      color:'#999'
      borderColor:'#ededed',
      height:100
    createdDate = moment(json.created_at,"YYYY-MM-DD HH:mm:ss Z").fromNow()
    updateTime = Ti.UI.createLabel
      font:
        fontSize:10
      color:'#666'
      right:0
      top:5
      width:60
      height:15
      text:createdDate

    row.add(updateTime)

    iconImage = Ti.UI.createImageView
      width:40
      height:40
      top:5
      left:5
      image:json.user.profile_image_url
    row.add(iconImage)

    handleName = Ti.UI.createLabel
      width:200
      height:15
      top:5
      left:60
      color:"#333"
      font:
        fontSize:12
        fontWeight:'bold'
      text:json.user.url_name + "が投稿しました"
    row.add(handleName)

    textLabel = Ti.UI.createLabel
      width:240
      height:20
      top:25
      left:60
      color:'#4BA503'
      font:
        fontSize:16
        fontWeight:'bold'
      text:json.title
    row.add(textLabel)

    bodySummary = Ti.UI.createLabel
      width:240
      height:50
      left:60
      top:45
      color:"#444"
      font:
        fontSize:12
      text:json.body.replace(/<\/?[^>]+>/gi, "")
    row.add(bodySummary)
    row.data = json
    row.className = 'entry'
    row.tags = json.tags

    return row
  createRowForLoadOldEntry: () ->
    nextPage =  Ti.App.Properties.getString('nextPageURL')

    row = Ti.UI.createTableViewRow
      touchEnabled:false
      width:320
      height:30
      borderWidth:2
      backgroundColor:'#222',
      borderColor:'#ededed',
      selectedBackgroundColor:'#59BB0C'
    textLabel = Ti.UI.createLabel
      width:320
      height:30
      top:0
      left:0
      color:'#fff'
      font:
        fontSize:16
        fontWeight:'bold'
      text:'以前の投稿を読み込む',
      textAlign:1
    row.add(textLabel)
    row.className = 'loadOldEntry'
    row.url = nextPage
    return row
    
    
module.exports = tableView


