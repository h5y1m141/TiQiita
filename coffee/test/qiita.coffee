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




describe 'QiitaClass', ->
  it '', ->
    Qiita = require('qiita')
    qiita = new Qiita()
