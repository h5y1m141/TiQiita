class Cache
  constructor:() ->
    db = Ti.Database.open('tiqiita')
    
    # アプリ内で利用するキャッシュという位置づけでiCloudへのバックアップは不要なので
    # 以下オプションを設定
    # http://docs.appcelerator.com/titanium/latest/#!/guide/Working_with_a_SQLite_Database

    db.file.setRemoteBackup false
    # ページ遷移状態を管理するためのTableを生成
    db.execute "CREATE TABLE IF NOT EXISTS pagination(category TEXT, lastURL TEXT, loadedPageURL TEXT, nextURL TEXT);"
    db.close()
    return
    
  setPageState:(category,nextURL,lastURL,loadedPageURL) ->
    db = Ti.Database.open('tiqiita')
    sql = "INSERT INTO pagination VALUES ('#{category}', '#{lastURL}', '#{loadedPageURL}', '#{nextURL}');"
    db.execute sql
    db.close()
    
    return
    
    
  showPageState:(category) ->
    db = Ti.Database.open('tiqiita')    
    sql = "SELECT category,nextURL,lastURL,loadedPageURL FROM pagination where category = '#{category}';"

    rs = db.execute sql
    Ti.API.info rs
    return rs.fieldByName("category")
    
        
module.exports = Cache  