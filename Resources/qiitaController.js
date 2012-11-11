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

  return qiitaController;

})();

module.exports = qiitaController;
