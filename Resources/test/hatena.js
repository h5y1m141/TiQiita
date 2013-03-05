
describe('hatenaクラスのためのテスト', function() {
  beforeEach(function() {
    var Hatena, hatena;
    Hatena = require('model/hatena');
    return hatena = new Hatena();
  });
  return describe('ログファイルの書き込み', function() {
    return it('ログが書き込める', function() {
      var value;
      value = {
        source: "qiita.isConnected()",
        time: moment().format("yyyy-mm-dd hh:mm:ss z"),
        message: "success"
      };
      return expect(controller.logging(value)).toBe(true);
    });
  });
});
