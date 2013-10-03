var Cache;

Cache = (function() {

  function Cache() {
    this.db = Ti.Database.open('tiqiita');
    this.db.file.setRemoteBackup(false);
    this.db.execute("CREATE TABLE IF NOT EXISTS pagination(id INTEGER PRIMARY KEY, category TEXT, last TEXT, loadedPage TEXT, next TEXT);");
    this.db.close();
  }

  return Cache;

})();

module.exports = Cache;
