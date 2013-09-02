
xdescribe('qiitaUserクラスのためのテスト', function() {
  var QiitaUser, async, localUserInfo, user, userInfo;
  QiitaUser = require('model/qiitaUser');
  user = new QiitaUser("h5y1m141@github");
  userInfo = null;
  localUserInfo = null;
  async = new AsyncSpec(this);
  async.beforeEach(function(done) {
    return runs(function() {
      return user.getUserInfo(function(json) {
        userInfo = json;
        return done();
      });
    });
  });
  it('Qiitaの該当ユーザ名を取得できる', function() {
    return runs(function() {
      return expect(userInfo.name).toBe("hiroshi oyamada");
    });
  });
  waits(1000);
  return it('取得済のQiitaユーザをローカルから読み取れる', function() {
    return runs(function() {
      var result;
      result = Titanium.App.Properties.getString("qiitaUserList");
      localUserInfo = JSON.parse(result);
      return expect(localUserInfo.name).toBe("hiroshi oyamada");
    });
  });
});

describe('ユーザリスト取得', function() {
  var QiitaUser, async1, user, userList;
  QiitaUser = require('model/qiitaUser');
  user = new QiitaUser("h5y1m141@github");
  userList = null;
  async1 = new AsyncSpec(this);
  async1.beforeEach(function(done) {
    return runs(function() {
      return user.getfollowingUserList(function(result) {
        userList = result;
        return done();
      });
    });
  });
  it('該当ユーザのフォローしてるユーザリストを取得できる', function() {
    return runs(function() {
      return expect(userList.length).toBe(9);
    });
  });
  waits(1000);
  return it('フォローしてるユーザリストをキャッシュから読み取れる', function() {
    return runs(function() {
      var cached, result;
      result = Titanium.App.Properties.getString("qiitaUserList");
      cached = JSON.parse(result);
      return expect(cached.length).toBe(9);
    });
  });
});
