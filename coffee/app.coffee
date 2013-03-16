# Ti.App.Propertiesの初期化  
## クリックイベント時の状態管理のために以下利用
Ti.App.Properties.setBool 'stateMainTableSlide',false

## storedStocks毎起動時に初期化
Ti.App.Properties.setString "storedStocks",null
Ti.App.Properties.setString "storedMyStocks",null


## フォローしてるタグの有無と、タグのリスト
Ti.App.Properties.getBool "followingTagsError", false
Ti.App.Properties.setList "followingTags",null

Ti.App.Properties.setList "TiQiitaMenu",[]


## 起動時には、投稿情報一覧を現在ページとしてステータス管理したいので
## currentPageにstoredStocksをセット

Ti.App.Properties.setString "currentPage","storedStocks"

# 起動時に一旦tokenをリセット。
# アカウントを切り替えて利用してる人や、フォローしてるタグの
# 情報が変わってる可能性あるため
Ti.App.Properties.setString 'QiitaToken',null
# Jasmine利用してテスト実行するかどうかのフラグ。
# trueにすることで、メインのアプリは起動せずに
# Jasmineのテストが実行される
testsEnabled = false


# 外部のライブラリ読み込み 
moment = require('lib/moment.min')
momentja = require('lib/momentja')

# 以下はmodelの読み込み
defaultState = require("model/defaultState")
slideState = require("model/slideState")
Qiita = require('model/qiita')
Hatena = require('model/hatena')
baseCommand = require("model/baseCommand")
hatena = new Hatena()
qiita = new Qiita()

hatena.login()
# 以下からコントローラー読み込み
MainContoroller = require('controllers/mainContoroller')
CommandController = require("controllers/commandController")
mainContoroller = new MainContoroller()
commandController = new CommandController()


# UI関連のファイル郡読み込み
MainTable = require('ui/mainTable')
MenuTable = require('ui/menuTable')
StatusView = require('ui/statusView')
AlertView = require('ui/alertView')
ProgressBar = require('ui/progressBar')
webView = require('ui/webView')
win = require('ui/window')
activityIndicator = require('ui/activityIndicator')
ConfigMenu = require("ui/configMenu")

statusView = new StatusView()
alertView = new AlertView()
progressBar = new ProgressBar()
mainTableView = new MainTable()
mainTable = mainTableView.getTable()
mainWindow = new win()
actInd = new activityIndicator()
menuTable = new MenuTable()
menu = menuTable.getMenu()
configMenu = new ConfigMenu()
configWindow = new win()
webWindow = new win()
webWindow.backButtonTitle = '戻る'

# あらかじめwebviewを生成しておかないと、メイン画面から
# 遷移した時にもたつく原因になるために以下を実施している    
webview = new webView()
webViewHeader = webview.retreiveWebViewHeader()
webViewContents = webview.retreiveWebView()
webWindow.add webViewHeader
webWindow.add webViewContents
webWindow.add actInd

configWindow.title = "Qiitaアカウント設定"
configWindow.backgroundColor = '#fff'
configWindow.add actInd
QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')

  

if testsEnabled is true
  require('test/tests')
else
  
  createCenterNavWindow = ->

    leftBtn = Ti.UI.createButton(title: "Menu")
    leftBtn.addEventListener "click", ->
      window.toggleLeftView()
      window.setCenterhiddenInteractivity "TouchDisabledWithTapToCloseBouncing"
      window.setPanningMode "NavigationBarPanning"

    mainWindow.leftNavButton = leftBtn
    mainWindow.add mainTable
    mainWindow.add actInd
    progressBar.show()
    statusView.add progressBar
    mainWindow.add statusView
    mainWindow.add alertView.getAlertView()


    
    #NAV
    navController = Ti.UI.iPhone.createNavigationGroup(window: mainWindow)
    return navController
    
  
  winLeft = Ti.UI.createWindow(backgroundColor: "white")
  winLeft.add menu

  navController = createCenterNavWindow()
  winRight = Ti.UI.createWindow(backgroundColor: "white")

  #//////////////////////////////////////////////
  # NappSlideMenu WINDOW
  NappSlideMenu = require("dk.napp.slidemenu")
  window = NappSlideMenu.createSlideMenuWindow(
    centerWindow: navController
    leftWindow: winLeft
    rightWindow: winRight
    leftLedge:160
  )

  mainContoroller.refreshMenuTable()
  mainContoroller.startApp()

  window.open() #init the app


