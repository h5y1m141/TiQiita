var mainTable;

mainTable = (function() {

  function mainTable() {
    var _this = this;
    this.table = Ti.UI.createTableView({
      backgroundColor: '#ededed',
      separatorColor: '#999',
      zIndex: 2,
      width: 320,
      left: 0,
      top: 0
    });
    this.table.addEventListener('click', function(e) {
      var storedTo;
      if (qiita.isConnected() === false) {
        return mainController._alertViewShow("ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください");
      } else {
        if (e.rowData.className === 'entry') {
          mainContoroller.sessionItem(e.rowData.data);
          mainContoroller.webViewContentsUpdate(e.rowData.data.body);
          mainContoroller.webViewHeaderUpdate(e.rowData.data);
          return mainContoroller.moveToWebViewWindow();
        } else if (e.rowData.className === "config") {
          return mainContoroller.login(e.rowData);
        } else {
          Ti.API.info("tableView eventListener start. storedTo is " + e.rowData.storedTo);
          storedTo = e.rowData.storedTo;
          return mainContoroller.loadOldEntry(storedTo);
        }
      }
    });
  }

  mainTable.prototype.getTable = function() {
    return this.table;
  };

  mainTable.prototype.insertRow = function(index, row) {
    this.table.insertRowAfter(index, row, {
      animated: true
    });
    return true;
  };

  mainTable.prototype.hideLastRow = function() {
    var lastRow;
    lastRow = this.table.data[0].rows.length - 1;
    return this.table.deleteRow(lastRow);
  };

  mainTable.prototype.lastRowIndex = function() {
    return this.table.data[0].rows.length - 2;
  };

  mainTable.prototype.createRow = function(json) {
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

  mainTable.prototype.createRowForLoadOldEntry = function(storedTo) {
    var row, textLabel;
    row = Ti.UI.createTableViewRow({
      touchEnabled: false,
      width: 320,
      height: 50,
      borderWidth: 2,
      backgroundColor: '#222',
      borderColor: '#ededed',
      selectedBackgroundColor: '#59BB0C'
    });
    textLabel = Ti.UI.createLabel({
      width: 320,
      height: 50,
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
    row.storedTo = storedTo;
    return row;
  };

  return mainTable;

})();

module.exports = mainTable;
