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
      var c, container, url, w, webView, webWindow, _i, _len;
      if (e.rowData.className === 'entry') {
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
        return tab.open(webWindow);
      } else {
        Ti.API.info('load old entry');
        url = Ti.App.Properties.getString('nextPageURL');
        Ti.API.info("NEXTPAGE:" + url);
        actInd.backgroundColor = '#222';
        actInd.opacity = 0.8;
        actInd.show();
        return qiita.getNextFeed(url, function(result, links) {
          var json, lastIndex, link, r, _j, _k, _len1, _len2;
          for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
            link = links[_j];
            if (link["rel"] === 'next') {
              Ti.App.Properties.setString('nextPageURL', link["url"]);
            }
          }
          for (_k = 0, _len2 = result.length; _k < _len2; _k++) {
            json = result[_k];
            r = t.createRow(json);
            lastIndex = t.lastRowIndex();
            Ti.API.info(lastIndex);
            t.insertRow(lastIndex, r);
          }
          return actInd.hide();
        });
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
