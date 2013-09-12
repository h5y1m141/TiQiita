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
maincontroller =new MainContoroller()

QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')

if testsEnabled is true
  require('test/tests')
else

  maincontroller.createTabGroup()


