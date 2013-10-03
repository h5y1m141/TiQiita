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
    db = null
    return
    
  setPageState:(category,nextURL,lastURL,loadedPageURL) ->
    db = Ti.Database.open('tiqiita')
    checkData = "SELECT category FROM pagination where category = '#{category}';"
    rs = db.execute checkData
    # Ti.API.info "recordSet is #{rs.rowCount}"
    if rs.rowCount is 0
       
      sql = "INSERT INTO pagination VALUES ('#{category}', '#{lastURL}', '#{loadedPageURL}', '#{nextURL}');"
    else
      Ti.API.info "update table"
      sql = "UPDATE pagination SET category = '#{category}' , lastURL ='#{lastURL}', loadedPageURL = '#{loadedPageURL}',nextURL = '#{nextURL}' where category = '#{category}';"
      Ti.API.info sql
      
    db.execute sql
    db.close()
    db = null
    
    return
    
    
  showPageState:(category) ->
    db = Ti.Database.open('tiqiita')    
    sql = "SELECT category,nextURL,lastURL,loadedPageURL FROM pagination where category = '#{category}';"

    rs = db.execute sql
    Ti.API.info rs
    obj =
      category: rs.fieldByName("category")
      nextURL:rs.fieldByName("nextURL")
      loadedPageURL:rs.fieldByName("loadedPageURL")
      lastURL:rs.fieldByName("lastURL")
      
    db.close()
    db = null
    return obj
    
        
module.exports = Cache  