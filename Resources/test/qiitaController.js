describe('qiitaControllerクラスのためのテスト', function() {
  beforeEach(function() {
    var controller, moment, momentja, qiitaController;
    qiitaController = require('controllers/qiitaController');
    controller = new qiitaController();
    moment = require('lib/moment.min');
    return momentja = require('lib/momentja');
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