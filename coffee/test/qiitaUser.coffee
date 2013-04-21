describe 'qiitaUserクラスのためのテスト', ->
  QiitaUser = require('model/qiitaUser')
  user = new QiitaUser("h5y1m141@github")
  userInfo = null
  async = new AsyncSpec(@)
  async.beforeEach (done) ->
    runs ->
      user.getUserInfo((json) ->

        userInfo = json
        done()
      )

          
  it 'Qiitaの該当ユーザ名を取得できる', () ->
    expect(userInfo.name).toBe "hiroshi oyamada"

  it '取得済のQiitaユーザをローカルから読み取れる', () ->
    qiitaUserList = Ti.App.Properties.getList "qiitaUserList"

    expect(qiitaUserList.length).toBe 0
