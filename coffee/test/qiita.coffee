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

  describe 'Qiitaのストック情報', ->

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

  describe 'Qiitaのフィード情報', ->
    feed = null
    nextPage = null
    lastPage = null
    async = new AsyncSpec(@)
    async.beforeEach (done) ->
      runs ->
        qiita.getFeed( (result,links) ->
          feed = result
          for link in links
            if link["rel"] is "next"
              nextPage = link["url"]
            else if link["rel"] is "last"
              lastPage = link["url"]
            else
              Ti.API.info link["url"]
              
          done()
        )
        
    it 'フィード情報が取得できる', () ->
      runs ->
        expect(feed).not.toBeNull()

    waits 1000
            
    it 'フィード情報の次のページのURLが取得できる', () ->
      runs ->
        expect(nextPage).toBe "https://qiita.com/api/v1/items?page=2"

    waits 1000
    
    it 'フィード情報の最後のページのURLが取得できる', () ->
      runs ->
        # expect(lastPage).toBe "https://qiita.com/api/v1/items?page=403"
        expect(lastPage).not.toBeNull()

  describe '認証処理', ->
    noToken = null
    token = null
        
    async = new AsyncSpec(@)
    async.beforeEach (done) ->
      runs ->
        failParam =
          url_name: "h5y1m141@github"
          password: "failpassword"
        qiita._auth(failParam)
        noToken = Ti.App.Properties.getString('QiitaTokenFail')
        done()
    
    it 'パスワードが違うのでtoken取得出来ない', ->
      errorMessage = 'Error Domain=ASIHTTPRequestErrorDomain Code=3 "Authentication needed" UserInfo=0xa3f1470 {NSLocalizedDescription=Authentication needed}'
      expect(noToken).toBe errorMessage


    asyncToken = new AsyncSpec(@)
    asyncToken.beforeEach (done) ->
      runs ->
        configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/login.json')
        file = configJSON.read().toString()
        config = JSON.parse(file)
        collectParam =
          url_name: config.url_name
          password: config.password
        qiita._auth(collectParam)
        token = Ti.App.Properties.getString('QiitaToken')
        done()
            
    it 'tokenが取得できる', ->
      expect(token.length).toBe 32

