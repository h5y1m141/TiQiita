var Cache;

Cache = (function() {

  function Cache() {
    var db;
    db = Ti.Database.open('tiqiita');
    db.file.setRemoteBackup(false);
    db.execute("CREATE TABLE IF NOT EXISTS pagination(category TEXT, lastURL TEXT, loadedPageURL TEXT, nextURL TEXT);");
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
    Ti.API.info(rs);
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

  return Cache;

})();

module.exports = Cache;
