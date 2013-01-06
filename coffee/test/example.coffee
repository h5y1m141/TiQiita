describe 'Qiitaクラスのためのテスト', ->
  beforeEach ->
    Qiita = require('qiita')
    qiita = new Qiita()
  
  describe 'Qiitaのストック情報', ->
    postItem =
      uuid:"1d65e3fc04ee4693122c"
      title:"MySQLで秘密のトークンなんかを0と比較したらちょい危険"
      
    postItemFlg = null
    async = new AsyncSpec(@)    
    async.beforeEach (done) ->
      qiita.putStock(postItem.uuid)
      postItemFlg = Ti.App.Properties.getBool("postItem")
      done()
    
    it 'ストックに成功する', () ->      
      runs ->
        expect(postItemFlg) is false
        
    waits 5000
    
    putStockFail = null
    postFail =
      uuid:"1"
      title:"MySQLで秘密のトークンなんかを0と比較したらちょい危険"
      
    async1 = new AsyncSpec(@)    
    async1.beforeEach (done) ->
      runs ->
        qiita.putStock(postFail.uuid)
        done()
      
    it '存在しないストックをポストした場合にはErrorになる', () ->      
      runs ->
        putStockFail = Ti.App.Properties.getString('QiitaPutStockFail')
        expect(putStockFail) is "error"

              
