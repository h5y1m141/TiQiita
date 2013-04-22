describe 'qiitaUserクラスのためのテスト', ->
  QiitaUser = require('model/qiitaUser')
  user = new QiitaUser("h5y1m141@github")
  userInfo = null
  localUserInfo = null
  async = new AsyncSpec(@)
  async.beforeEach (done) ->
    runs ->
      user.getUserInfo((json) ->
        userInfo = json
        done()
      )

          
  it 'Qiitaの該当ユーザ名を取得できる', () ->
    runs ->
      expect(userInfo.name).toBe "hiroshi oyamada"

  waits 1000
  
  
  it '取得済のQiitaユーザをローカルから読み取れる', () ->
    runs ->
      result = Titanium.App.Properties.getString "qiitaUserList"
      localUserInfo = JSON.parse(result)
      expect(localUserInfo.name).toBe "hiroshi oyamada"
  