var Qiita, actInd, mainTable, moment, momentja, q, rows, t, tab, tableView, tg, token, win1;

Qiita = require('qiita');

tableView = require('tableView');

moment = require('lib/moment.min');

momentja = require('lib/momentja');

t = new tableView();

q = new Qiita();

token = Ti.App.Properties.getString('QiitaToken');

if (token === null) {
  q._auth();
}

Ti.API.info('Token is' + token);

win1 = Ti.UI.createWindow({
  title: 'Qiita',
  barColor: '#59BB0C'
});

actInd = Ti.UI.createActivityIndicator({
  zIndex: 10,
  top: 100,
  left: 120,
  height: 40,
  width: 'auto',
  font: {
    fontFamily: 'Helvetica Neue',
    fontSize: 15,
    fontWeight: 'bold'
  },
  color: '#fff',
  message: 'loading...'
});

actInd.show();

win1.add(actInd);

mainTable = t.getTable();

rows = [];

q.getFeed(function(result, links) {
  var json, link, _i, _j, _len, _len1;
  for (_i = 0, _len = links.length; _i < _len; _i++) {
    link = links[_i];
    if (link["rel"] === 'next') {
      Ti.App.Properties.setString('nextPageURL', link["url"]);
    }
  }
  for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
    json = result[_j];
    rows.push(t.createRow(json));
  }
  rows.push(t.createRowForLoadOldEntry());
  mainTable.setData(rows);
  actInd.hide();
  win1.add(mainTable);
  return true;
});

tg = Ti.UI.createTabGroup();

tab = Ti.UI.createTab({
  window: win1
});

tg.addTab(tab);

tg.open();
