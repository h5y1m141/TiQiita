moment = require('lib/moment.min')
momentja = require('lib/momentja')
Qiita = require('model/qiita')
MainTable = require('ui/mainTable')
menuTable = require('ui/menuTable')
StatusView = require('ui/statusView')
statusView = new StatusView()
AlertView = require('ui/alertView')
alertView = new AlertView()

ProgressBar = require('ui/progressBar')
progressBar = new ProgressBar()

MainContoroller = require('controllers/mainContoroller')
mainContoroller = new MainContoroller()
qiitaController = require('controllers/qiitaController')
CommandController = require("controllers/commandController")
commandController = new CommandController()

defaultState = require("model/defaultState")
slideState = require("model/slideState")

webView = require('ui/webView')
win = require('ui/window')
activityIndicator = require('ui/activityIndicator')

mainTableView = new MainTable()

qiita = new Qiita()
controller = new qiitaController()


# Ti.App.Propertiesの初期化  
## クリックイベント時の状態管理のために以下利用
Ti.App.Properties.setBool 'stateMainTableSlide',false

## storedStocks毎起動時に初期化
Ti.App.Properties.setString "storedStocks",null
Ti.App.Properties.setString "storedMyStocks",null


## フォローしてるタグ
Ti.App.Properties.setList "followingTags",null

## 起動時には、投稿情報一覧を現在ページとしてステータス管理したいので
## currentPageにstoredStocksをセット

Ti.App.Properties.setString "currentPage","storedStocks"

# Jasmine
# 
testsEnabled = false


if testsEnabled is true
  require('test/tests')
else

  # 投稿一覧情報を取得
  mainTable = mainTableView.getTable()
  mainWindow = new win()
  actInd = new activityIndicator()
  listBtn = Ti.UI.createButton
    systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
    
  listBtn.addEventListener('click',()->
    direction = "horizontal"
    controller.slideMainTable(direction)
  )
  
  refreshBtn = Ti.UI.createButton
    systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
    
  refreshBtn.addEventListener('click',()->
    mainContoroller.networkConnectionCheck(()->
      controller.loadEntry()
    )
  )
  menu = new menuTable()
  
  mainWindow.add actInd
  mainWindow.add mainTable
  mainWindow.add menu
  progressBar.show()
  statusView.add progressBar
  mainWindow.add statusView


  mainWindow.add alertView.getAlertView()
  mainWindow.leftNavButton  = listBtn
  mainWindow.rightNavButton  = refreshBtn

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

  mainContoroller.init()
  
  tabGroup = Ti.UI.createTabGroup()
  tabGroup.tabBarVisible = false
  tab = Ti.UI.createTab
    window: mainWindow
  tabGroup.addTab tab
  tabGroup.open()
