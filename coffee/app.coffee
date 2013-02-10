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

qiita = new Qiita()

# 以下からコントローラー読み込み
MainContoroller = require('controllers/mainContoroller')
qiitaController = require('controllers/qiitaController')
CommandController = require("controllers/commandController")
controller = new qiitaController()
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

statusView = new StatusView()
alertView = new AlertView()
progressBar = new ProgressBar()
mainTableView = new MainTable()
mainTable = mainTableView.getTable()
mainWindow = new win()
actInd = new activityIndicator()
menuTable = new MenuTable()
menu = menuTable.getMenu()
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



if testsEnabled is true
  require('test/tests')
else
  mainContoroller.init()
