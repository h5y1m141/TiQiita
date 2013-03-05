describe 'hatenaクラスのためのテスト', ->
  beforeEach ->
    Hatena = require 'model/hatena'
    hatena = new Hatena()

  describe 'ログファイルの書き込み', ->
    it 'ログが書き込める', ->

      value =
        source  : "qiita.isConnected()"
        time    : moment().format("yyyy-mm-dd hh:mm:ss z")
        message : "success"
      expect(controller.logging(value)).toBe true





