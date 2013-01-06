
describe('Qiitaクラスのためのテスト', function() {
  beforeEach(function() {
    var Qiita, qiita;
    Qiita = require('qiita');
    return qiita = new Qiita();
  });
  return describe('Qiitaのストック情報', function() {
    var async, async1, postFail, postItem, postItemFlg, putStockFail;
    postItem = {
      uuid: "1d65e3fc04ee4693122c",
      title: "MySQLで秘密のトークンなんかを0と比較したらちょい危険"
    };
    postItemFlg = null;
    async = new AsyncSpec(this);
    async.beforeEach(function(done) {
      qiita.putStock(postItem.uuid);
      postItemFlg = Ti.App.Properties.getBool("postItem");
      return done();
    });
    it('ストックに成功する', function() {
      return runs(function() {
        return expect(postItemFlg) === false;
      });
    });
    waits(5000);
    putStockFail = null;
    postFail = {
      uuid: "1",
      title: "MySQLで秘密のトークンなんかを0と比較したらちょい危険"
    };
    async1 = new AsyncSpec(this);
    async1.beforeEach(function(done) {
      return runs(function() {
        qiita.putStock(postFail.uuid);
        return done();
      });
    });
    return it('存在しないストックをポストした場合にはErrorになる', function() {
      return runs(function() {
        putStockFail = Ti.App.Properties.getString('QiitaPutStockFail');
        return expect(putStockFail) === "error";
      });
    });
  });
});
