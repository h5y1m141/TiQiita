var qiitaController;

qiitaController = (function() {

  function qiitaController() {}

  qiitaController.prototype.loadOldEntry = function() {
    var url;
    url = Ti.App.Properties.getString('nextPageURL');
    Ti.API.info("NEXTPAGE:" + url);
    actInd.backgroundColor = '#222';
    actInd.opacity = 0.8;
    actInd.show();
    qiita.getNextFeed(url, function(result, links) {
      var json, lastIndex, link, r, _i, _j, _len, _len1, _results;
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        if (link["rel"] === 'next') {
          Ti.App.Properties.setString('nextPageURL', link["url"]);
        }
      }
      _results = [];
      for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
        json = result[_j];
        r = t.createRow(json);
        lastIndex = t.lastRowIndex();
        t.insertRow(lastIndex, r);
        _results.push(actInd.hide());
      }
      return _results;
    });
    return true;
  };

  qiitaController.prototype.stockItemToQiita = function(uuid) {
    uuid = Ti.App.Properties.getString('stockUUID');
    actInd.backgroundColor = '#222';
    actInd.message = 'Posting...';
    actInd.zIndex = 20;
    actInd.show();
    qiita.putStock(uuid);
    return true;
  };

  qiitaController.prototype.sessionItem = function(json) {
    Ti.API.info("start sessionItem. url is " + json.url + ". uuid is " + json.uuid);
    if (json) {
      Ti.App.Properties.setString('stockURL', json.url);
      Ti.App.Properties.setString('stockUUID', json.uuid);
      return Ti.App.Properties.setString('stockID', json.id);
    }
  };

  qiitaController.prototype.postItemToHatena = function() {
    var configJSON, file, hatena, hatenaKey;
    Ti.API.info(Ti.App.Properties.getString('stockURL'));
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/hatena.json');
    file = configJSON.read().toString();
    hatenaKey = JSON.parse(file);
    hatena = require('lib/hatena').Hatena({
      consumerKey: hatenaKey.consumerKey,
      consumerSecret: hatenaKey.consumerSecret,
      accessTokenKey: Ti.App.Properties.getString("hatenaAccessTokenKey", ""),
      accessTokenSecret: Ti.App.Properties.getString("hatenaAccessTokenSecret", ""),
      scope: "read_public,write_public,write_private"
    });
    hatena.addEventListener('login', function(e) {
      Ti.API.info("start hanate login");
      if (e.success) {
        Ti.App.Properties.setString('hatenaAccessTokenKey', e.accessTokenKey);
        Ti.App.Properties.setString('hatenaAccessTokenSecret', e.accessTokenSecret);
        return hatena.request('applications/my.json', {}, {}, 'POST', function(req) {
          var data;
          Ti.API.info(req);
          if (req.success) {
            Ti.API.info("start hatena API request");
            data = JSON.parse(req.result.text);
            return Ti.API.info(data);
          }
        });
      }
    });
    hatena.authorize();
    return true;
  };

  return qiitaController;

})();

module.exports = qiitaController;
