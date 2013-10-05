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

## フォローしてるタグの有無と、タグのリスト
Ti.App.Properties.getBool "followingTagsError", false
Ti.App.Properties.setList "followingTags",null



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
  configMenu = require("ui/#{osname}/configMenu")
  MenuTable = require("ui/iphone/menuTable")

  mainListView = new ListView()
  MainWindow = new MainWindow()
  configMenu = new configMenu()
  MenuTable = new MenuTable()
    
  configmenu = configMenu.getMenu()
  mainWindow = MainWindow.getWindow()
  menu = MenuTable.getMenuTable()
  
  mainWindow.add mainListView
  mainWindow.add configmenu
  mainWindow.add menu

  maincontroller.getFeed()
  mainWindow.open()



