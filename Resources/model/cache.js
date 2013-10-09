var Cache;

Cache = (function() {

  function Cache() {
    var db;
    db = Ti.Database.open('tiqiita');
    db.file.setRemoteBackup(false);
    db.execute("CREATE TABLE IF NOT EXISTS pagination(category TEXT, lastURL TEXT, loadedPageURL TEXT, nextURL TEXT);");
    db.execute("CREATE TABLE IF NOT EXISTS items(category TEXT,uuid TEXT, title TEXT, body TEXT,user TEXT, tags TEXT, updated_at DATE, updated_at_in_words TEXT);");
    db.execute("DELETE from pagination;");
    db.execute("DELETE from items;");
    db.close();
    db = null;
    return;
  }

  Cache.prototype.setPageState = function(category, nextURL, lastURL, loadedPageURL) {
    var checkData, db, rs, sql;
    db = Ti.Database.open('tiqiita');
    checkData = "SELECT category FROM pagination where category = '" + category + "';";
    rs = db.execute(checkData);
    if (rs.rowCount === 0) {
      sql = "INSERT INTO pagination VALUES ('" + category + "', '" + lastURL + "', '" + loadedPageURL + "', '" + nextURL + "');";
    } else {
      Ti.API.info("update table");
      sql = "UPDATE pagination SET category = '" + category + "' , lastURL ='" + lastURL + "', loadedPageURL = '" + loadedPageURL + "',nextURL = '" + nextURL + "' where category = '" + category + "';";
      Ti.API.info(sql);
    }
    db.execute(sql);
    db.close();
    db = null;
  };

  Cache.prototype.showPageState = function(category) {
    var db, obj, rs, sql;
    db = Ti.Database.open('tiqiita');
    sql = "SELECT category,nextURL,lastURL,loadedPageURL FROM pagination where category = '" + category + "';";
    rs = db.execute(sql);
    obj = {
      category: rs.fieldByName("category"),
      nextURL: rs.fieldByName("nextURL"),
      loadedPageURL: rs.fieldByName("loadedPageURL"),
      lastURL: rs.fieldByName("lastURL")
    };
    db.close();
    db = null;
    return obj;
  };

  Cache.prototype.hasCached = function(category) {
    var db, flg, rs, sql;
    db = Ti.Database.open('tiqiita');
    sql = "SELECT category FROM items where category = '" + category + "';";
    rs = db.execute(sql);
    if (rs.rowCount === 0) {
      flg = false;
    } else {
      flg = true;
    }
    db.close();
    db = null;
    return flg;
  };

  Cache.prototype.find = function(category) {
    var db, items, rs, sql, tags, user;
    items = [];
    db = Ti.Database.open('tiqiita');
    db.execute('BEGIN');
    sql = "SELECT * FROM items where category = '" + category + "';";
    Ti.API.info("find sql start. sql is : " + sql);
    rs = db.execute(sql);
    while (rs.isValidRow()) {
      user = JSON.parse(rs.fieldByName("user"));
      tags = JSON.parse(rs.fieldByName("tags"));
      items.push({
        category: rs.fieldByName("category"),
        uuid: rs.fieldByName("uuid"),
        title: rs.fieldByName("title"),
        body: rs.fieldByName("body"),
        user: user,
        tags: tags,
        updated_at: rs.fieldByName("updated_at"),
        updated_at_in_words: rs.fieldByName("updated_at_in_words")
      });
      rs.next();
    }
    db.execute('COMMIT');
    db.close();
    db = null;
    return items;
  };

  Cache.prototype.save = function(items, category) {
    var db, item, sql, tags, user, _i, _len;
    Ti.API.info("start local cache.");
    db = Ti.Database.open('tiqiita');
    db.execute('BEGIN');
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      user = JSON.stringify(item.user);
      tags = JSON.stringify(item.tags);
      sql = "INSERT INTO items VALUES ('" + category + "', '" + item.uuid + "','" + item.title + "', '" + item.body + "','" + user + "','" + tags + "','" + item.created_at + "','" + item.created_at_in_words + "');";
      db.execute(sql);
    }
    db.execute('COMMIT');
    db.close();
    return db = null;
  };

  return Cache;

})();

module.exports = Cache;
