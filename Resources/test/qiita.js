xdescribe('QiitaのStaticプロパティへのアクセス', function() {
  return it('指定のurlプロパティにアクセスした場合に値が一致する', function() {
    var Qiita, qiita, url;
    Qiita = require('qiita');
    qiita = new Qiita();
    url = "https://qiita.com/api/v1/users/h5y1m141@github/stocks";
    return expect(qiita.parameter.stocks.url).toBe(url);
  });
});
describe('Qiitaクラスのためのテスト', function() {
  beforeEach(function() {
    var Qiita, qiita;
    Qiita = require('qiita');
    return qiita = new Qiita();
  });
  describe('ネットワークの接続確認:正常系', function() {
    return it('ネットワーク利用できる状況にある', function() {
      return expect(qiita.isConnected()).toBe(true);
    });
  });
  describe('Qiitaのストック情報', function() {
    var async, content, lastPage, lastPageContents, nextPage, postFail, postItem, putStockFail;
    content = null;
    nextPage = null;
    lastPage = null;
    lastPageContents = null;
    async = new AsyncSpec(this);
    async.beforeEach(function(done) {
      return runs(function() {
        return qiita.getMyStocks(function(result, links) {
          var link, _i, _len;
          for (_i = 0, _len = links.length; _i < _len; _i++) {
            link = links[_i];
            if (link["rel"] === "next") {
              nextPage = link["url"];
            } else if (link["rel"] === "last") {
              lastPage = link["url"];
              qiita.getNextFeed(lastPage, function(result, links) {
                return lastPageContents = result;
              });
            } else {
              Ti.API.info(link["url"]);
            }
          }
          content = result;
          return done();
        });
      });
    });
    waits(1000);
    it('投稿情報取得出来る', function() {
      return runs(function() {
        return expect(content).not.toBeNull();
      });
    });
    it('投稿情報の件数が一致する', function() {
      return runs(function() {
        return expect(content.length).toBe(20);
      });
    });
    it('最終ページに移動できる', function() {
      return runs(function() {
        return expect(lastPageContents instanceof Array).toBe(true);
      });
    });
    it('原因がわからないが自分のアカウントで最終ページに到達すると投稿情報空になるので、その確認', function() {
      return runs(function() {
        return expect(lastPageContents.length).toBe(0);
      });
    });
    waits(1000);
    postItem = {
      uuid: "1d65e3fc04ee4693122c",
      title: "MySQLで秘密のトークンなんかを0と比較したらちょい危険"
    };
    xit('ストックに成功する', function() {
      return runs(function() {
        return expect(qiita.putStock(postItem.uuid)) === true;
      });
    });
    putStockFail = null;
    postFail = {
      uuid: "1",
      title: "MySQLで秘密のトークンなんかを0と比較したらちょい危険"
    };
    async.beforeEach(function(done) {
      return runs(function() {
        qiita.putStock(postFail.uuid);
        return done();
      });
    });
    return xit('存在しないストックをポストした場合にはErrorになる', function() {
      return runs(function() {
        putStockFail = Ti.App.Properties.getString('QiitaPutStockFail');
        return expect(putStockFail) === "error";
      });
    });
  });
  xdescribe('Qiitaのフィード情報', function() {
    var async, feed, lastPage, nextPage;
    feed = null;
    nextPage = null;
    lastPage = null;
    async = new AsyncSpec(this);
    async.beforeEach(function(done) {
      return runs(function() {
        return qiita.getFeed(function(result, links) {
          var link, _i, _len;
          feed = result;
          for (_i = 0, _len = links.length; _i < _len; _i++) {
            link = links[_i];
            if (link["rel"] === "next") {
              nextPage = link["url"];
            } else if (link["rel"] === "last") {
              lastPage = link["url"];
            } else {
              Ti.API.info(link["url"]);
            }
          }
          return done();
        });
      });
    });
    it('フィード情報が取得できる', function() {
      return runs(function() {
        return expect(feed).not.toBeNull();
      });
    });
    waits(1000);
    it('フィード情報の次のページのURLが取得できる', function() {
      return runs(function() {
        return expect(nextPage).toBe("https://qiita.com/api/v1/items?page=2");
      });
    });
    waits(1000);
    return it('フィード情報の最後のページのURLが取得できる', function() {
      return runs(function() {
        return expect(lastPage).not.toBeNull();
      });
    });
  });
  return xdescribe('認証処理', function() {
    var async, asyncToken, noToken, token;
    noToken = null;
    token = null;
    async = new AsyncSpec(this);
    async.beforeEach(function(done) {
      return runs(function() {
        var failParam;
        failParam = {
          url_name: "h5y1m141@github",
          password: "failpassword"
        };
        qiita._auth(failParam);
        noToken = Ti.App.Properties.getString('QiitaTokenFail');
        return done();
      });
    });
    it('パスワードが違うのでtoken取得出来ない', function() {
      var errorMessage;
      errorMessage = 'Error Domain=ASIHTTPRequestErrorDomain Code=3 "Authentication needed" UserInfo=0xa3f1470 {NSLocalizedDescription=Authentication needed}';
      return expect(noToken).toBe(errorMessage);
    });
    asyncToken = new AsyncSpec(this);
    asyncToken.beforeEach(function(done) {
      return runs(function() {
        var collectParam, config, configJSON, file;
        configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/login.json');
        file = configJSON.read().toString();
        config = JSON.parse(file);
        collectParam = {
          url_name: config.url_name,
          password: config.password
        };
        qiita._auth(collectParam);
        token = Ti.App.Properties.getString('QiitaToken');
        return done();
      });
    });
    return it('tokenが取得できる', function() {
      return expect(token.length).toBe(32);
    });
  });
});