Qiita = require('qiita')
tableView = require('tableView')
menuTable = require('menuTable')

moment = require('lib/moment.min')
momentja = require('lib/momentja')
qiitaController = require('qiitaController')
defaultState = require("defaultState")
slideState = require("slideState")

webView = require('webView')


t = new tableView()
qiita = new Qiita()
controller = new qiitaController()

  
# クリックイベント時の状態管理のために以下利用
Ti.App.Properties.setBool('stateMainTableSlide',false)

# storedStocks毎起動時に初期化
Ti.App.Properties.setString("storedStocks",null)

# Jasmine
# 
testsEnabled = true



if testsEnabled is true
  require('test/tests')

# 投稿一覧情報を取得
mainTable = t.getTable()


token = Ti.App.Properties.getString('QiitaToken')
if token is null
  qiita._auth()
Ti.API.info('Token is' + token)

mainWindow = Ti.UI.createWindow
  title:'Qiita'
  barColor:'#59BB0C'




actInd = Ti.UI.createActivityIndicator
  zIndex:10
  top:100
  left: 120
  height: 40
  width: 'auto'
  font: 
    fontFamily:'Helvetica Neue'
    fontSize:15
    fontWeight:'bold'
  color: '#fff'
  message: 'loading...'
actInd.show()
mainWindow.add(actInd)

rows = []
qiita.getFeed( (result,links) ->

  for link in links
    if link["rel"] == 'next'
      Ti.App.Properties.setString('nextPageURL',link["url"])
    
  rows.push(t.createRow(json)) for json in result
  rows.push(t.createRowForLoadOldEntry())
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
mainWindow.leftNavButton  = listBtn



webWindow = Ti.UI.createWindow
  backButtonTitle:'戻る',
  barColor:'#59BB0C'
  
webview = new webView()
webViewHeader = webview.retreiveWebViewHeader()
webViewContents = webview.retreiveWebView()
webWindow.add webViewHeader
webWindow.add webViewContents
webWindow.add actInd

tabGroup = Ti.UI.createTabGroup()
tab = Ti.UI.createTab
  window: mainWindow
tabGroup.addTab(tab)
tabGroup.open()
