# ここはjasmine-titaniumの基本的な動作確認のためのテスト
  
describe 'QiitaのStaticプロパティへのアクセス', ->
  it '指定のurlプロパティにアクセスした場合に値が一致する', ->
    Qiita = require('qiita')
    qiita = new Qiita()
    url = "https://qiita.com/api/v1/users/h5y1m141@github/stocks"
    expect(qiita.parameter.stocks.url).toBe(url)

describe 'Qiitaクラスのためのテスト', ->

  beforeEach ->
    Qiita = require('qiita')
    qiita = new Qiita()
    
    

  describe 'ネットワークの接続確認:正常系', ->
    it 'ネットワーク利用できる状況にある', ->
      expect(qiita.isConnected()).toBe true

  describe 'QiitaのStock取得', ->

    content = null
    async = new AsyncSpec(@)
    async.beforeEach (done) ->
      runs ->
        qiita.getMyStocks( (result,links) ->
          content = result
          done()
        )
      
    waits 1000
    
    it '投稿情報取得出来る', ()->
      runs ->
        expect(content).not.toBeNull()

    it '投稿情報の件数が一致する', () ->
      runs ->
        expect(content.length).toBe 20
        

        

     