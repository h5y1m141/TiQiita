var Cache;

Cache = (function() {

  function Cache() {
    var db;
    db = Ti.Database.open('tiqiita');
    db.file.setRemoteBackup(false);
    db.execute("CREATE TABLE IF NOT EXISTS pagination(category TEXT, lastURL TEXT, loadedPageURL TEXT, nextURL TEXT);");
    db.close();
    return;
  }

  Cache.prototype.setPageState = function(category, nextURL, lastURL, loadedPageURL) {
    var db, sql;
    db = Ti.Database.open('tiqiita');
    sql = "INSERT INTO pagination VALUES ('" + category + "', '" + lastURL + "', '" + loadedPageURL + "', '" + nextURL + "');";
    db.execute(sql);
    db.close();
  };

  Cache.prototype.showPageState = function(category) {
    var db, rs, sql;
    db = Ti.Database.open('tiqiita');
    sql = "SELECT category,nextURL,lastURL,loadedPageURL FROM pagination where category = '" + category + "';";
    rs = db.execute(sql);
    Ti.API.info(rs);
    return rs.fieldByName("category");
  };

  return Cache;

})();

module.exports = Cache;
