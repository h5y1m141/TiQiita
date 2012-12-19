# ここはjasmine-titaniumの基本的な動作確認のためのテスト
  
describe 'QiitaのStaticプロパティへのアクセス', ->
  it '指定のurlプロパティにアクセスした場合に値が一致する', ->
    Qiita = require('qiita')
    qiita = new Qiita()
    url = "https://qiita.com/api/v1/users/h5y1m141@github/stocks"
    expect(qiita.parameter.stocks.url).toBe(url)


describe 'ネットワークの接続確認:正常系', ->
  it 'ネットワーク利用できる状況にある', ->
    Qiita = require('qiita')
    qiita = new Qiita()
    
    expect(qiita.isConnected()).toBe true

describe 'QiitaのStock取得', ->
  it '投稿情報取得したら投稿数が一致する', ->
    Qiita = require('qiita')
    qiita = new Qiita()
    qiita.getMyStocks( (result,links) ->
      expect(result.length).toBe(20)
    )

describe 'Qiitaのアイテム', ->
  it 'テスト目的でローカルに準備してある複数の投稿情報が含まれた配列の結合', ->
    Qiita = require('qiita')
    qiita = new Qiita()
    items = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'test/items.json')
    anoterhItems = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'test/anotherItems.json')
    
    o1 = JSON.parse items.read().toString()
    o2 = JSON.parse anoterhItems.read().toString()
    result = qiita._mergeItems(o1,o2)
    expect(result.length).toBe(40)

