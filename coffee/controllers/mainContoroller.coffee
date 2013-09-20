class mainContoroller
  constructor:() ->
    Hatena = require("model/hatena")
    @hatena = new Hatena()
    Qiita = require("model/qiita")
    @qiita = new Qiita()
        
    @tabSetting =
      "iphone":
        "main":
          "windowName":"mainWindow"
      ,    
      "android":
        "main":
          "windowName":"mainWindow"      

    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
  createTabGroup:() ->
    tabGroup = Ti.UI.createTabGroup
      tabsBackgroundColor:"#f9f9f9"
      shadowImage:"ui/image/shadowimage.png"
      tabsBackgroundImage:"ui/image/tabbar.png"
      activeTabBackgroundImage:"ui/image/activetab.png"  
      activeTabIconTint:"#fffBD5"
      
    tabGroup.addEventListener('focus',(e) ->
      tabGroup._activeTab = e.tab
      tabGroup._activeTabIndex = e.index
      if tabGroup._activeTabIndex is -1
        return

      Ti.API._activeTab = tabGroup._activeTab;

    )
    osname = Ti.Platform.osname

    MainWindow = require("ui/#{osname}/mainWindow")
    mainWindow = new MainWindow()
    mainTab = Titanium.UI.createTab
      window:mainWindow
      windowName:@tabSetting[osname].main.windowName

    tabGroup.addTab mainTab
    tabGroup.open()
    
  qiitaLogin:() ->
    param =
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')

    Ti.API.debug "[INFO] login start."  
    @qiita._auth(param, (token)=>
      Ti.API.debug "token is #{token}"
      if token is null
        alert "ユーザIDかパスワードが間違ってます"
        
      else
        alert "認証出来ました"
        Ti.App.Properties.setString 'QiitaLoginID', param.url_name
        Ti.App.Properties.setString 'QiitaLoginPassword', param.password
        Ti.App.Properties.setString 'QiitaToken', token
    )
    
  getFeedByTag:(tagName) ->
    storedTo = "followingTag#{tagName}"
    items = JSON.parse(Ti.App.Properties.getString(storedTo))
    moment = require('lib/moment.min')
    momentja = require('lib/momentja')
    
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    if items? is false or items is ""
      @qiita.getFeedByTag(tagName, (result,links) =>
        # http://d.hatena.ne.jp/yatemmma/20110723/1311534794を参考に実装
        # なお比較した結果、1を最初に返すと更新日古い順番にソートされる
        result.sort( (a, b) ->

          (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
        )
        
        # rows.push(mainTableView.createRow(json)) for json in result
        Ti.API.info result.length
        
        if result.length isnt MAXITEMCOUNT
          Ti.API.info "loadOldEntry hide"  
        else
          Ti.API.info storedTo
          rows.push(mainTableView.createRowForLoadOldEntry(storedTo))
        
        mainTable.setData rows

      )

    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
    
      result.push(mainTableView.createRow(json)) for json in items
      result.push(mainTableView.createRowForLoadOldEntry(storedTo))
      mainTable.setData result
    
  setItems:() ->
    that = @
    @qiita.getFeed( (result) ->
      that.refresData(result)
    )

  getFeed:() ->
    that = @
    @qiita.getFeed( (result) ->
      that.refresData(result)
    )

    
  refresData: (data) ->
    sections = []
    section = Ti.UI.createListSection()
    
    dataSet = @createItems(data)
      
    # 過去の投稿を読み込むためのもの
    section = Ti.UI.createListSection()
    loadOld =
      loadOld:true
      properties:
        selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE
      title:
        text: 'load old'
      
    dataSet.push(loadOld)
    
    section.setItems dataSet
    sections.push section
    # app.jsでmainListView = new ListView()としている
    # ListViewにアイテムをセット
    Ti.API.info mainListView
    return mainListView.setSections sections
    
  createItems:(data) ->
    dataSet = []

    for _items in data
      rawData = _items
      layout =
        properties:
          height:120
          selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE
          data:rawData
          
        title:
          text: _items.title
        icon:
          image: _items.user.profile_image_url
        updateTime:
          text: _items.updated_at_in_words
        handleName:
          text: _items.user.url_name
        contents:
          text: _items.body.replace(/<\/?[^>]+>/gi, "")
          # text: _items.raw_body
        tags:
          text: 'javascript,ruby,Titanium'
        tagIcon:
          text:String.fromCharCode("0xe128")
      dataSet.push(layout)
                
    return dataSet

  init:() ->
    loginID  = Ti.App.Properties.getString 'QiitaLoginID'
    password = Ti.App.Properties.getString 'QiitaLoginPassword'
    _ = require("lib/underscore-min")

    if @qiita.isConnected() is false

      @_alertViewShow @networkDisconnectedMessage

    else if loginID? is false or loginID is ""
      rootWindow.toggleRightView()
      commandController.useMenu "storedStocks"


    else
      Ti.API.info "start mainWindow"
      Ti.API.info( Ti.App.Properties.getString('QiitaToken'))
      @refreshMenuTable()
      commandController.useMenu "storedStocks"

      

      
    return true

  networkConnectionCheck:(callback) ->

    if @qiita.isConnected() is false
      @_alertViewShow @networkDisconnectedMessage
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "networkConnectionCheck #{currentPage}"
      return
    else
      return callback()
      
  authenticationCheck:(callback)->
    token = Ti.App.Properties.getString 'QiitaToken'
    if token is null
      @_alertViewShow @authenticationFailMessage
    else
      return callback()
    
  _alertViewShow:(messsage) ->
    alertView.editMessage messsage
    alertView.animate()
    

    
  refreshMenuTable:() ->
    Ti.API.debug "refreshMenuTable"
    return menuTable.refreshMenu()

  loadEntry: () ->
    currentPage = Ti.App.Properties.getString "currentPage"
    Ti.API.info "qiitaController.loadEntry start. currentPage is #{currentPage}"
    # 現在ページのパラメータを引数に該当キャッシュをクリアーして
    # 該当コマンド実行することで再度QiitaAPIにアクセス可能になる

    Ti.App.Properties.setString currentPage, null
    items = JSON.parse(Ti.App.Properties.getString(currentPage))

    
    commandController.useMenu currentPage


  _showStatusView:() =>
    Ti.API.info "[ACTION] スライド開始"
    progressBar.value = 0
    progressBar.show()    
    statusView.animate({
        duration:400
        top:0
    },() ->
      Ti.API.debug "mainTable を上にずらす"
      mainTable.animate({
        duration:200
        top:50
      })
    )


  _hideStatusView:() =>
    Ti.API.info "[ACTION] スライドから標準状態に戻る。垂直方向"
    mainTable.animate({
      duration:200
      top:0
    },()->
      Ti.API.debug "mainTable back"
      progressBar.hide()
      statusView.animate({
        duration:400
        top:-50
      })
    )

  loadOldEntry: (storedTo) ->

    
    @_showStatusView()

    MAXITEMCOUNT = 20
    currentPage = Ti.App.Properties.getString "currentPage"
    nextURL = Ti.App.Properties.getString "#{currentPage}nextURL"
    

    Ti.API.info nextURL
    
    if nextURL isnt null
      @qiita.getNextFeed(nextURL,storedTo,(result) =>
        @_hideStatusView()
        Ti.API.info "getNextFeed start. result is #{result.length}"

        # ここで投稿件数をチェックして、20件以下だったら過去のを
        # 読み込むrowを非表示にすればOK
        if result.length isnt MAXITEMCOUNT
          mainTableView.hideLastRow()
        else
          for json in result
            r = mainTableView.createRow(json)
            lastIndex = mainTableView.lastRowIndex()
            mainTableView.insertRow(lastIndex,r)
        
      )
    return true
    
  stockItem: (uuid,url,contents,qiitaPostFlg,hatenaPostFlg,callback) =>
    hatena = @hatena    
    # 最初にQiitaへの投稿処理を必要に応じて実施して
    # それが終わったらはてブした上でそれぞれの投稿処理が
    # 成功失敗の情報をcallback関数に渡す

    qiitaPostResult = false
    hatenaPostResult = false
    
    if qiitaPostFlg is true
      @qiita.putStock(uuid,(qiitaresult) ->
        if qiitaresult is 'success'
          qiitaPostResult = true

        if hatenaPostFlg is true  
          hatena.postBookmark(url,contents,(hatenaresult) ->
            Ti.API.info "postBookmark result is #{hatenaresult}"
            if hatenaresult.success
              hatenaPostResult = true
            Ti.API.info "Qiitaとはてブ同時投稿終了。結果は#{qiitaPostResult}と#{hatenaPostResult}です"
            result = [qiitaPostResult,hatenaPostResult]
            return callback(result)  
          )
        else
          result = [qiitaPostResult,hatenaPostResult]
          return callback(result)  
      )
    else
      if hatenaPostFlg is true  
        hatena.postBookmark(url,contents,(hatenaresult) ->
          Ti.API.info "postBookmark result is #{hatenaresult}"
          if hatenaresult.success
            hatenaPostResult = true
          Ti.API.info "はてブ投稿終了。結果は#{qiitaPostResult}と#{hatenaPostResult}です"  
          result = [qiitaPostResult,hatenaPostResult]
          return callback(result)    
        )
    


  sessionItem: (json) ->
    Ti.API.info "start sessionItem. url is #{json.url}. uuid is #{json.uuid}"
    if json
      Ti.App.Properties.setString('stockURL',json.url)
      Ti.App.Properties.setString('stockUUID',json.uuid)
      Ti.App.Properties.setString('stockID',json.id)
  
  slideMainTable: (direction) ->
    slideState = Ti.App.Properties.getBool("stateMainTableSlide") 
    Ti.API.info "[SLIDEMAINTABLE] direction is #{direction}.slideState is #{slideState}"

    if slideState is false and direction is "vertical"
      @state = @state.moveDown()
    else if slideState is true and direction is "vertical"
      @state = @state.moveUP()
    else
      return 
  selectMenu:(menuName) ->
    Ti.API.info "mainController.selectMenu start. menuName is #{menuName}"
    return commandController.useMenu menuName

  webViewContentsUpdate: (body) ->
    return webview.contentsUpdate(body)
    
  webViewHeaderUpdate: (json) ->
    return webview.headerUpdate(json)

  moveToWebViewWindow: () ->
    

    Ti.API.info "webview show finish #{moment()}"
    Ti.API.info "#{webview.getStockUUID()}"
    navController.open webWindow
    return



module.exports = mainContoroller  