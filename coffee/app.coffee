# GoogleAnalyticsによるトラッキングのための処理

Config = require("model/loadConfig")
config = new Config()
gaKey = config.getGoogleAnalyticsKey()

gaModule = require('lib/Ti.Google.Analytics')
analytics = new gaModule(gaKey)




Ti.App.addEventListener "analytics_trackPageview", (e) ->
  path = Titanium.Platform.name
  analytics.trackPageview path + e.pageUrl

Ti.App.addEventListener "analytics_trackEvent", (e) ->
  analytics.trackEvent e.category, e.action, e.label, e.value

Ti.App.Analytics =
  trackPageview: (pageUrl) ->
    Ti.App.fireEvent "analytics_trackPageview",
      pageUrl: pageUrl


  trackEvent: (category, action, label, value) ->
    Ti.App.fireEvent "analytics_trackEvent",
      category: category
      action: action
      label: label
      value: value

analytics.start 10, true


# Ti.App.Propertiesの初期化  

## storedStocks毎起動時に初期化
Ti.App.Properties.setString "storedStocks",null
Ti.App.Properties.setString "storedMyStocks",null


## フォローしてるタグの有無と、タグのリスト
Ti.App.Properties.getBool "followingTagsError", false
Ti.App.Properties.setList "followingTags",null



## 起動時には、投稿情報一覧を現在ページとしてステータス管理したいので
## currentPageにstoredStocksをセット

Ti.App.Properties.setString "currentPage","storedStocks"
# Jasmine利用してテスト実行するかどうかのフラグ。
# trueにすることで、メインのアプリは起動せずに
# Jasmineのテストが実行される
testsEnabled = false


# 以下からコントローラー読み込み
MainContoroller = require('controllers/mainContoroller')
maincontroller = new MainContoroller()

QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')

if testsEnabled is true
  require('test/tests')
else
  # maincontroller.createTabGroup()
  

  osname = Ti.Platform.osname
  ListView = require("ui/#{@osname}/listView")
  MainWindow = require("ui/#{osname}/mainWindow")
  mainListView = new ListView()
  mainWindow = new MainWindow()
  mainWindow.add mainListView
  maincontroller.getFeed()
  mainWindow.open()

