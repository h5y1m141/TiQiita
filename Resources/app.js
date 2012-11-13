var Qiita, actInd, composeBtn, controller, listBtn, mainTable, mainWindow, menuTable, moment, momentja, qiita, qiitaController, rows, t, tab, tabGroup, tableView, token;

Qiita = require('qiita');

tableView = require('tableView');

menuTable = require('menuTable');

moment = require('lib/moment.min');

momentja = require('lib/momentja');

qiitaController = require('qiitaController');

t = new tableView();

qiita = new Qiita();

controller = new qiitaController();

Ti.App.Properties.setBool('stateMainTableSlide', false);

token = Ti.App.Properties.getString('QiitaToken');

if (token === null) {
  qiita._auth();
}

Ti.API.info('Token is' + token);

mainWindow = Ti.UI.createWindow({
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

mainWindow.add(actInd);

mainTable = t.getTable();

rows = [];

qiita.getFeed(function(result, links) {
  var json, link, menu, _i, _j, _len, _len1;
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
  mainWindow.add(mainTable);
  menu = new menuTable();
  mainWindow.add(menu);
  return true;
});

composeBtn = Ti.UI.createButton({
  systemButton: Titanium.UI.iPhone.SystemButton.INFO,
  title: 'setting'
});

mainWindow.rightNavButton = composeBtn;

listBtn = Ti.UI.createButton({
  systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
});

listBtn.addEventListener('click', function(e) {
  if (Ti.App.Properties.getBool("stateMainTableSlide") === false) {
    return mainTable.animate({
      duration: 200,
      left: 80
    }, function() {
      return Ti.App.Properties.setBool("stateMainTableSlide", true);
    });
  } else {
    return mainTable.animate({
      duration: 200,
      left: 0
    }, function() {
      return Ti.App.Properties.setBool("stateMainTableSlide", false);
    });
  }
});

mainWindow.leftNavButton = listBtn;

tabGroup = Ti.UI.createTabGroup();

tab = Ti.UI.createTab({
  window: mainWindow
});

tabGroup.addTab(tab);

tabGroup.open();
