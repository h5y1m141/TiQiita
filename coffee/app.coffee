moment = require('lib/moment.min')
momentja = require('lib/momentja')
Qiita = require('model/qiita')
tableView = require('ui/tableView')
menuTable = require('ui/menuTable')
StatusView = require('ui/statusView')
statusView = new StatusView()
AlertView = require('ui/alertView')
alertView = new AlertView()

ProgressBar = require('ui/progressBar')
progressBar = new ProgressBar()

qiitaController = require('controllers/qiitaController')
PageController = require('controllers/pageController')
pageController = new PageController()
CommandController = require("controllers/commandController")
commandController = new CommandController()

defaultState = require("model/defaultState")
slideState = require("model/slideState")

webView = require('ui/webView')
win = require('ui/window')
activityIndicator = require('ui/activityIndicator')

t = new tableView()
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

# Jasmine
# 
testsEnabled = false


if testsEnabled is true
  require('test/tests')
else

  # 投稿一覧情報を取得
  mainTable = t.getTable()
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
    controller.loadEntry()
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

  if controller.networkStatus() is false
    alertView.editMessage("ネットワークが利用できない状態です。ご利用の端末のネットワーク設定を再度ご確認ください")

    alertView.animate()
    
  else  
    # direction = "horizontal"
    direction = "vertical"
    controller.slideMainTable(direction)
    commandController.useMenu "storedStocks"
    # commandController.useMenu "storedMyStocks"
    commandController.useMenu "followingTags"
  
    
  
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

  tabGroup = Ti.UI.createTabGroup()
  tabGroup.tabBarVisible = false
  tab = Ti.UI.createTab
    window: mainWindow
  tabGroup.addTab tab
  tabGroup.open()
