var tableView;

tableView = (function() {

  function tableView() {
    this.table = Ti.UI.createTableView({
      backgroundColor: '#ededed',
      separatorColor: '#999',
      zIndex: 2,
      width: 320,
      left: 0,
      top: 0
    });
  }

  tableView.prototype.getTable = function() {
    this.table.addEventListener('click', function(e) {
      var c, configBtn, container, stockInd, w, webView, webWindow, _i, _len;
      if (e.rowData.className === 'entry') {
        em.sessionItem(e.rowData.data);
        webWindow = Ti.UI.createWindow({
          backButtonTitle: '戻る',
          barColor: '#59BB0C'
        });
        webView = require('webView');
        w = new webView();
        container = w.create(e.rowData.data);
        for (_i = 0, _len = container.length; _i < _len; _i++) {
          c = container[_i];
          webWindow.add(c);
        }
        stockInd = Ti.UI.createActivityIndicator({
          zIndex: 10,
          top: 100,
          left: 120,
          height: 40,
          width: 'auto',
          backgroundColor: '#222',
          font: {
            fontFamily: 'Helvetica Neue',
            fontSize: 15,
            fontWeight: 'bold'
          },
          color: '#fff',
          message: 'loading...'
        });
        webWindow.add(actInd);
        configBtn = Ti.UI.createButton({
          systemButton: Titanium.UI.iPhone.SystemButton.COMPOSE
        });
        configBtn.addEventListener('click', function() {
          var dialog;
          dialog = Ti.UI.createOptionDialog();
          dialog.setTitle("どの処理を実行しますか？");
          dialog.setOptions(["Stock", "はてなブックマークに送る", "キャンセル"]);
          dialog.setCancel(2);
          dialog.addEventListener('click', function(event) {
            Ti.API.info("start dialog action.Event is " + event.index);
            return em.stockItemToQiita();
          });
          return dialog.show();
        });
        webWindow.rightNavButton = configBtn;
        return tab.open(webWindow);
      } else {
        return em.loadOldEntry();
      }
    });
    return this.table;
  };

  tableView.prototype.insertRow = function(index, row) {
    this.table.insertRowAfter(index, row, {
      animated: true
    });
    return true;
  };

  tableView.prototype.lastRowIndex = function() {
    return this.table.data[0].rows.length - 2;
  };

  tableView.prototype.createRow = function(json) {
    var bodySummary, createdDate, handleName, iconImage, row, textLabel, updateTime;
    row = Ti.UI.createTableViewRow({
      width: 320,
      borderWidth: 2,
      color: '#999',
      borderColor: '#ededed',
      height: 100
    });
    createdDate = moment(json.created_at, "YYYY-MM-DD HH:mm:ss Z").fromNow();
    updateTime = Ti.UI.createLabel({
      font: {
        fontSize: 10
      },
      color: '#666',
      right: 0,
      top: 5,
      width: 60,
      height: 15,
      text: createdDate
    });
    row.add(updateTime);
    iconImage = Ti.UI.createImageView({
      width: 40,
      height: 40,
      top: 5,
      left: 5,
      image: json.user.profile_image_url
    });
    row.add(iconImage);
    handleName = Ti.UI.createLabel({
      width: 200,
      height: 15,
      top: 5,
      left: 60,
      color: "#333",
      font: {
        fontSize: 12,
        fontWeight: 'bold'
      },
      text: json.user.url_name + "が投稿しました"
    });
    row.add(handleName);
    textLabel = Ti.UI.createLabel({
      width: 240,
      height: 20,
      top: 25,
      left: 60,
      color: '#4BA503',
      font: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      text: json.title
    });
    row.add(textLabel);
    bodySummary = Ti.UI.createLabel({
      width: 240,
      height: 50,
      left: 60,
      top: 45,
      color: "#444",
      font: {
        fontSize: 12
      },
      text: json.body.replace(/<\/?[^>]+>/gi, "")
    });
    row.add(bodySummary);
    row.data = json;
    row.className = 'entry';
    row.tags = json.tags;
    return row;
  };

  tableView.prototype.createRowForLoadOldEntry = function() {
    var nextPage, row, textLabel;
    nextPage = Ti.App.Properties.getString('nextPageURL');
    row = Ti.UI.createTableViewRow({
      touchEnabled: false,
      width: 320,
      height: 30,
      borderWidth: 2,
      backgroundColor: '#222',
      borderColor: '#ededed',
      selectedBackgroundColor: '#59BB0C'
    });
    textLabel = Ti.UI.createLabel({
      width: 320,
      height: 30,
      top: 0,
      left: 0,
      color: '#fff',
      font: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      text: '以前の投稿を読み込む',
      textAlign: 1
    });
    row.add(textLabel);
    row.className = 'loadOldEntry';
    row.url = nextPage;
    return row;
  };

  return tableView;

})();

module.exports = tableView;
