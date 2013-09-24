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
        configMenu.hide()
      else
        alert "認証出来ました"
        configMenu.hide()        
        Ti.App.Properties.setString 'QiitaLoginID', param.url_name
        Ti.App.Properties.setString 'QiitaLoginPassword', param.password
        Ti.App.Properties.setString 'QiitaToken', token
        #  認証済とわかるように、Qiitaのユーザ情報からアイコン画像のパスを取得しておく
        @qiita.getUserInfo(param.url_name,(json) ->
          Ti.API.info "getUserInfo done userInfo is #{json.profile_image_url}"
          Ti.App.Properties.setString "qiitaProfileImageURL", json.profile_image_url
        )
        
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
          @refresData(result)

      )

    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
      @refresData(items)
  getFeed:() ->
    items = JSON.parse(Ti.App.Properties.getString("storedStocks"))
    moment = require('lib/moment.min')
    momentja = require('lib/momentja')
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    
    if items? is false or items is ""
      @qiita.getFeed( (result,links) =>
        result.sort( (a, b) ->
          (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
        )
        
        if result.length isnt MAXITEMCOUNT
          Ti.API.info "loadOldEntry hide"
        else
          @refresData(result)

      )
      
    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
      @refresData(items)    
            
  getMyStocks:() ->
    MAXITEMCOUNT = 20 # 1リクエスト辺りに読み込まれる最大件数
    items = JSON.parse(Ti.App.Properties.getString('storedMyStocks'))
    moment = require('lib/moment.min')
    momentja = require('lib/momentja')
    if items? is false or items is ""
      
    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
      @refresData(items)
      
  # フォロワー投稿を取得するメソッド
  getFollowerItems:() ->
    items = JSON.parse(Ti.App.Properties.getString("followerItems"))
    moment = require('lib/moment.min')
    momentja = require('lib/momentja')
    
    if items? is false or items is ""
      qiitaUser = require("model/qiitaUser")
      qiitaUser = new qiitaUser()
      qiitaUser.getfollowingUserList( (userList) =>
        # 1)フォローしてるユーザ情報のuserListを
        # 順番にループして個々のユーザの投稿情報を取得
        for item in userList
          _url = "https://qiita.com/api/v1/users/#{item.url_name}/items?per_page=5"
          _items = []
          xhr = Ti.Network.createHTTPClient()
          xhr.open("GET",_url)
          xhr.onload = ->
            if @.status is 200
              items = JSON.parse(@.responseText)
              if items isnt null
                for item in items
                  _items.push item

          xhr.onerror = (e) ->
            error = JSON.parse(@.responseText)
            Ti.API.info error
          xhr.timeout = 5000  
          xhr.send()
          
        # 1)の処理は非同期で実施されるため、最終的に
        # 全部のユーザの投稿情報を取得するのに時間がかかるため
        # ひとまず10秒間まってから取得した投稿情報のローカルへのキャッシュを実施
        setTimeout (=>
          _items.sort( (a, b) ->
            (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
          )
          # フォローしてるユーザの投稿情報をローカルにキャッシュ
          Ti.App.Properties.setString("followerItems",JSON.stringify(_items))
          @refresData(_items)
        ),10000          
      )
    else
      items.sort( (a, b) ->

        (if moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm") then -1 else 1)
      )
      @refresData(items)      
              
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
  



module.exports = mainContoroller  