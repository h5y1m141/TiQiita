class Cache
  constructor:() ->
    @db = Ti.Database.open('tiqiita')
    
    # アプリ内で利用するキャッシュという位置づけでiCloudへのバックアップは不要なので
    # 以下オプションを設定
    # http://docs.appcelerator.com/titanium/latest/#!/guide/Working_with_a_SQLite_Database

    @db.file.setRemoteBackup false
    # ページ遷移状態を管理するためのTableを生成
    @db.execute "CREATE TABLE IF NOT EXISTS pagination(id INTEGER PRIMARY KEY, category TEXT, last TEXT, loadedPage TEXT, next TEXT);"
    @db.close()    
module.exports = Cache  