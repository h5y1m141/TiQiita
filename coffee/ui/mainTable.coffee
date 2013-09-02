class mainTable
  constructor: () ->
    @table = Ti.UI.createTableView
      backgroundColor:'#ededed'
      separatorColor: '#999'
      zIndex:2
      width:320
      left:0
      top:50
    @arrow = Ti.UI.createView
      backgroundImage:"ui/image/arrow.png"
      width:30
      height:30
      bottom:20
      left:20

      
    @statusMessage = Ti.UI.createLabel
      text:"引っ張って更新"
      left:55,
      width:220,
      bottom:35,
      height:"auto",
      color:"#000"
      textAlign:"center",
      font:{fontSize:13,fontWeight:"bold"}


    pullToRefresh = @._createPullToRefresh(
      backgroundColor: "#CCC"
      action: ->
        setTimeout (->
          refresh()
        ), 500
    )
    
    @pulling = false
    
    @table.headerPullView = pullToRefresh
    
    @table.addEventListener("scroll",(e) =>

      offset = e.contentOffset.y

      if offset <= -65.0 and not @pulling
        t = Ti.UI.create2DMatrix().scale(1)
        t = t.rotate(-180)
        @pulling = true
        @arrow.animate
          transform: t
          duration: 180
          
        @statusMessage.text = "指を離して更新"

      else if @pulling and offset > -65.0 and offset < 0
        @pulling = false
        t = Ti.UI.create2DMatrix().scale(1)
        @arrow.animate
          transform: t
          duration: 180
        mainContoroller.loadEntry()    
        @statusMessage.text = "引っ張って更新"
        
      else

    )

    @table.addEventListener('click',(e) =>
      # TableViewの一番下に、過去投稿を読み込むためのボタンを
      # 配置しており、そのrowだけは投稿詳細画面に遷移させない
      # 詳細画面にいくかどうかはrowのclassNameの値をチェックする
      actionBtn = @_createActionBtn()
      if qiita.isConnected() is false
        mainController._alertViewShow "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
      else if e.rowData.className is 'entry'
        screenHeight = Ti.Platform.displayCaps.platformHeight
        adViewHeight = 50
        webViewHeaderHight = 55
        barHeight = 60
        
        webViewHeight = screenHeight - (barHeight + webViewHeaderHight + adViewHeight)
        webViewTopPosition = barHeight
        adViewTopPosition = webViewHeight + webViewTopPosition
      
        Admob = require("ti.admob")
        adView = Admob.createView
          width             :320
          height            :adViewHeight
          top               :adViewTopPosition
          left              :0
          zIndex            :20
          adBackgroundColor :'black',
          publisherId       :"a1516c99bf7991a"

        # 一覧画面から詳細画面に遷移した後、該当の投稿情報を
        # ストックする際にURLやuuidの情報が必要になるために
        # sessionItem()を利用する
        Ti.API.info "start eventListener #{moment()}"
        WebView = require('ui/webView')
        webview = new WebView()
        webViewHeader = webview.retreiveWebViewHeader()
        webViewContents = webview.retreiveWebView()
        detailInfoWindow = Ti.UI.createWindow
          title:'投稿情報詳細画面'
          barColor:'#59BB0C'
          navBarHidden: false
          tabBarHidden: false

        detailInfoWindow.add webViewHeader
        detailInfoWindow.add webViewContents        
        webview.contentsUpdate(e.rowData.data.body)
        webview.headerUpdate(e.rowData.data)
        if e.rowData.data?
          webview.setStockURL(e.rowData.data.url)
          webview.setStockUUID(e.rowData.data.uuid)

        detailInfoWindow.rightNavButton = actionBtn
        detailInfoWindow.add adView
        navController.open detailInfoWindow

      else if e.rowData.className is "config"
        mainContoroller.login e.rowData
      else
        Ti.API.info "tableView eventListener start. storedTo is #{e.rowData.storedTo}"
        storedTo = e.rowData.storedTo
        mainContoroller.loadOldEntry storedTo

    )
    
  getTable: ()->
    return @table
  insertRow: (index,row)->
    @table.insertRowAfter(index,row,{animated:true})
    return true
    
  hideLastRow: () ->
    #以前の投稿が存在しない場合には、読み込むボタンを配置した
    # rowを非表示にしたいのでそのためのメソッド
    lastRow = @table.data[0].rows.length-1
    @table.deleteRow lastRow
    
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
      defaultImage:"ui/image/logo-square.png"
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
  createRowForLoadOldEntry: (storedTo) ->
    row = Ti.UI.createTableViewRow
      touchEnabled:false
      width:320
      height:50
      borderWidth:2
      backgroundColor:'#222',
      borderColor:'#ededed',
      selectedBackgroundColor:'#59BB0C'
    textLabel = Ti.UI.createLabel
      width:320
      height:50
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
    row.storedTo = storedTo
    return row
    
    
  _createPullToRefresh: (parameters) ->
    loadingCallback = parameters.action
    
    view = Ti.UI.createView
      backgroundColor:parameters.backgroundColor
      width:320
      height:60

    
    view.add @arrow
    view.add @statusMessage
    
    return view
  _createActionBtn:() ->
    actionBtn = Ti.UI.createButton
      systemButton: Titanium.UI.iPhone.SystemButton.ACTION
  
    actionBtn.addEventListener('click',()->
      dialog = Ti.UI.createOptionDialog()
      dialog.setTitle "どの処理を実行しますか？"
      dialog.setOptions(["Qiitaへストック","はてブ","Qiitaへストック&はてブ","キャンセル"])
      dialog.setCancel(3)
      dialog.addEventListener('click',(event) =>
        hatenaAccessTokenKey  = Ti.App.Properties.getString("hatenaAccessTokenKey")
        QiitaToken = Ti.App.Properties.getString('QiitaToken')
        alertDialog = Titanium.UI.createAlertDialog()
        alertDialog.setTitle("Error")
        Ti.API.debug "start dialog action.Event is #{event.index}"
  
        switch event.index
          when 0
            if QiitaToken? is true
              mainContoroller.stockItemToQiita()
            else
              alertDialog.setMessage("Qiitaのアカウント設定が完了していないため投稿できません")
              alertDialog.show()
          when 1
            if hatenaAccessTokenKey? is true
              mainContoroller.stockItemToHatena()
            else
              alertDialog.setMessage("はてなのアカウント設定が完了していないため投稿できません")
              alertDialog.show()
  
          when 2
            if hatenaAccessTokenKey? is true and QiitaToken? is true
              mainContoroller.stockItemToQiita()
              mainContoroller.stockItemToHatena()
            else
              alertDialog.setMessage("Qiitaかはてなのアカウント設定が完了していないため投稿できません")
              alertDialog.show()
          
            
            
            
            
      )
      dialog.show()
    )
    return actionBtn
      
      
module.exports = mainTable


