moment = require('lib/moment.min')
momentja = require('lib/momentja')
Qiita = require('qiita')
tableView = require('ui/tableView')
menuTable = require('ui/menuTable')


qiitaController = require('controllers/qiitaController')

defaultState = require("defaultState")
slideState = require("slideState")

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

## QiitaAPIのページネーション処理で利用
Ti.App.Properties.setBool "isLastPage",false


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


  # qiita._auth()
  # Ti.API.info Ti.App.Properties.getString('QiitaToken')


  actInd.show()
  mainWindow.add actInd

  rows = []
  qiita.getFeed( (result,links) ->
      
    rows.push(t.createRow(json)) for json in result
    rows.push(t.createRowForLoadOldEntry('storedStocks'))
    mainTable.setData rows
    actInd.hide()
    mainWindow.add mainTable
    # 自分がチェックしてるタグを取得して、左側にサブメニューとして配置
    menu = new menuTable()
    mainWindow.add menu
    
    return true
  )  



  listBtn = Ti.UI.createButton
    systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
    
  listBtn.addEventListener('click',()->
    controller.slideMainTable()
  )
  
  refreshBtn = Ti.UI.createButton
    systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
    

    
  refreshBtn.addEventListener('click',()->
    controller.loadEntry()
  )
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

  tabGroup = Ti.UI.createTabGroup()
  tab = Ti.UI.createTab
    window: mainWindow
  tabGroup.addTab tab
  tabGroup.open()
