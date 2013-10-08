class Cache
  constructor:() ->
    db = Ti.Database.open('tiqiita')

    # アプリ内で利用するキャッシュという位置づけでiCloudへのバックアップは不要なので
    # 以下オプションを設定
    # http://docs.appcelerator.com/titanium/latest/#!/guide/Working_with_a_SQLite_Database

    db.file.setRemoteBackup false
    # ページ遷移状態を管理するためのTableを生成
    db.execute "CREATE TABLE IF NOT EXISTS pagination(category TEXT, lastURL TEXT, loadedPageURL TEXT, nextURL TEXT);"
    db.execute "CREATE TABLE IF NOT EXISTS items(category TEXT,uuid TEXT, title TEXT, body TEXT,user TEXT, tags TEXT, updated_at DATE, updated_at_in_words TEXT);"
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
    obj =
      category: rs.fieldByName("category")
      nextURL:rs.fieldByName("nextURL")
      loadedPageURL:rs.fieldByName("loadedPageURL")
      lastURL:rs.fieldByName("lastURL")
      
    db.close()
    db = null
    return obj
    
  hasCached:(category) ->
    db = Ti.Database.open('tiqiita')
    sql = "SELECT category FROM items where category = '#{category}';"
    rs = db.execute sql
    if rs.rowCount is 0
      flg = false
    else
      flg = true
    db.close()
    db = null
    return flg
    

  find:(category) ->
    items = []
    db = Ti.Database.open('tiqiita')

    # トランザクションにて処理
    db.execute('BEGIN')
    sql = "SELECT * FROM items where category = '#{category}';"
    Ti.API.info "find sql start. sql is : #{sql}"
    rs = db.execute sql
    
    while rs.isValidRow()
      user = JSON.parse(rs.fieldByName("user"))
      tags = JSON.parse(rs.fieldByName("tags"))
      items.push({
        category:rs.fieldByName("category")
        uuid:rs.fieldByName("uuid")
        title:rs.fieldByName("title")
        body:rs.fieldByName("body")
        user:user
        tags:tags
        updated_at:rs.fieldByName("updated_at")
        updated_at_in_words:rs.fieldByName("updated_at_in_words")
      })

      rs.next()
      
    db.execute('COMMIT')
    db.close()
    db = null
    
    return items
  
  save:(items,category) ->
    Ti.API.info "start local cache."
    db = Ti.Database.open('tiqiita')
    # トランザクションにて処理
    db.execute('BEGIN')
    # 実際の処理開始
    for item in items
      user = JSON.stringify(item.user)
      tags =JSON.stringify(item.tags)
      sql = "INSERT INTO items VALUES ('#{category}', '#{item.uuid}','#{item.title}', '#{item.body}','#{user}','#{tags}','#{item.created_at}','#{item.created_at_in_words}');"
      db.execute sql
    db.execute('COMMIT')
    db.close()
    db = null
                
module.exports = Cache  