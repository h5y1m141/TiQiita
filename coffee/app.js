// Generated by CoffeeScript 1.3.3
(function() {
  var Qiita, mainTable, q, result, stocks, t, tableView, token, win1;

  Qiita = require('qiita');

  tableView = require('tableView');

  t = new tableView();

  q = new Qiita();

  token = Ti.App.Properties.getString('QiitaToken');

  if (token === null) {
    q._auth();
  }

  Ti.API.info('Token is' + token);

  win1 = Ti.UI.createWindow({
    title: 'test',
    backgroundColor: "#fff"
  });

  q.getStocks();

  stocks = Ti.App.Properties.getString('QiitaStocks');

  result = JSON.parse(stocks);

  Ti.API.info("stocks:" + result.length);

  ["ストックした投稿", "フォロー中のゆーざ"];

  mainTable = t.getTable();

  win1.add(mainTable);

  win1.open();

}).call(this);
