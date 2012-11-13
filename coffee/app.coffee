Qiita = require('qiita')
tableView = require('tableView')
menuTable = require('menuTable')
moment = require('lib/moment.min')
momentja = require('lib/momentja')
qiitaController = require('qiitaController')

t = new tableView()
qiita = new Qiita()
controller = new qiitaController()

# クリックイベント時の状態管理のために以下利用
Ti.App.Properties.setBool('stateMainTableSlide',false)


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

# 投稿一覧情報を取得
mainTable = t.getTable()
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



composeBtn = Ti.UI.createButton
  systemButton: Titanium.UI.iPhone.SystemButton.INFO
  title:'setting'

mainWindow.rightNavButton = composeBtn

listBtn = Ti.UI.createButton
  systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
  
listBtn.addEventListener('click',(e)->
  
  if Ti.App.Properties.getBool("stateMainTableSlide") is false
    mainTable.animate({
      duration:200,
      left:80
    },()-> Ti.App.Properties.setBool("stateMainTableSlide",true))

  else
    mainTable.animate({
      duration:200
      left:0
    }, ()-> Ti.App.Properties.setBool("stateMainTableSlide",false))
    
)
mainWindow.leftNavButton  = listBtn



tabGroup = Ti.UI.createTabGroup()
tab = Ti.UI.createTab
  window: mainWindow
tabGroup.addTab(tab)
tabGroup.open()
