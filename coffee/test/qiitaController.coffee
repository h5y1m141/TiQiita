describe 'qiitaControllerクラスのためのテスト', ->

  beforeEach ->
    qiitaController = require('controllers/qiitaController')
    controller = new qiitaController()
    moment = require('lib/moment.min')
    momentja = require('lib/momentja')

  describe 'ログファイルの書き込み', ->
    it 'ログが書き込める', ->
      # value の形式は以下を想定
      # {
        # source:""
        # time:
        # message:""
      # }
      value =
        source  : "qiita.isConnected()"
        time    : moment().format("yyyy-mm-dd hh:mm:ss z")
        message : "success"
      expect(controller.logging(value)).toBe true


