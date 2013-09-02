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




# 外部のライブラリ読み込み

moment = require('lib/moment.min')
momentja = require('lib/momentja')

# 以下はmodelの読み込み
Qiita = require('model/qiita')
QiitaUser = require('model/qiitaUser')
Hatena = require('model/hatena')
baseCommand = require("model/baseCommand")
qiitaUser = new QiitaUser()
qiita = new Qiita()


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


QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')

  

if testsEnabled is true
  require('test/tests')
else
  
  createCenterNavWindow = ->

    leftBtn = Ti.UI.createButton(title: "Menu")
    leftBtn.addEventListener "click", ->
      rootWindow.toggleLeftView()
      rootWindow.setCenterhiddenInteractivity "TouchDisabledWithTapToCloseBouncing"
      rootWindow.setPanningMode "NavigationBarPanning"

    rightBtn = Ti.UI.createButton(title: "Config")
    rightBtn.addEventListener "click", ->
      rootWindow.toggleRightView()
      rootWindow.setCenterhiddenInteractivity "TouchDisabledWithTapToCloseBouncing"
      rootWindow.setPanningMode "NavigationBarPanning"  

    mainWindow.leftNavButton = leftBtn
    mainWindow.rightNavButton = rightBtn
    mainWindow.add mainTable
    progressBar.show()
    statusView.add progressBar
    mainWindow.add statusView
    
    mainWindow.add alertView.getAlertView()


    
    #NAV
    navController = Ti.UI.iPhone.createNavigationGroup
      window: mainWindow
      width:'auto'
      height:'auto'
    return navController
    
  
  winLeft = Ti.UI.createWindow(backgroundColor: "white")
  winLeft.add menu
  configWindow = new win()
  configWindow.title = "Qiitaアカウント設定"
  configWindow.backgroundColor = '#fff'
  configWindow.add actInd


  configWindow.add configMenu.getTable()
  configWindow.add alertView.getAlertView()
  navController = createCenterNavWindow()
  

  #//////////////////////////////////////////////
  # NappSlideMenu WINDOW
  NappSlideMenu = require("dk.napp.slidemenu")
  rootWindow = NappSlideMenu.createSlideMenuWindow(
    centerWindow: navController
    leftWindow: winLeft
    rightWindow: configWindow
    leftLedge:200
    rightLedge:50
  )

  rootWindow.open()
  mainContoroller.init()
