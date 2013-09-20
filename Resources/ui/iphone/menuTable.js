var menuTable;

menuTable = (function() {

  function menuTable() {
    var backgroundColorBase, rows,
      _this = this;
    backgroundColorBase = '#222';
    this.backgroundColorSub = '#333';
    this.qiitaColor = '#59BB0C';
    this.fontThemeWhite = {
      top: 5,
      left: 5,
      color: "#fff",
      font: {
        fontSize: 12,
        fontWeight: "bold"
      }
    };
    this.rowColorTheme = {
      width: 255,
      left: 1,
      opacity: 0.8,
      borderColor: '#ededed',
      height: 40,
      backgroundColor: this.backgroundColorSub
    };
    this.menuTable = Ti.UI.createTableView({
      backgroundColor: backgroundColorBase,
      separatorStyle: 1,
      separatorColor: backgroundColorBase,
      zIndex: 1,
      width: 200,
      left: 0,
      top: 0
    });
    this.menuTable.addEventListener('click', function(e) {
      var curretRowIndex, mainController, tagName;
      MainWindow.resetSlide();
      curretRowIndex = e.index;
      tagName = _this.menuTable.data[0].rows[curretRowIndex].className;
      mainController = require("controllers/mainContoroller");
      mainController = new mainController();
      return mainController.getFeedByTag(tagName);
    });
    rows = [this.makeAllLabelRow()];
    this.refreshMenu();
    this.menuTable.setData(rows);
    return this.menuTable;
  }

  menuTable.prototype.makeAllLabelRow = function() {
    var allLabel, allLabelRow, allStockBtn,
      _this = this;
    allLabelRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    allLabelRow.backgroundColor = this.backgroundColorSub;
    allLabelRow.addEventListener('click', function(e) {});
    allStockBtn = Ti.UI.createImageView({
      image: "ui/image/light_list.png",
      left: 5,
      top: 8,
      backgroundColor: "transparent"
    });
    allLabel = Ti.UI.createLabel({
      width: 255,
      height: 40,
      top: 0,
      left: 35,
      wordWrap: true,
      color: '#fff',
      font: {
        fontSize: 12,
        fontWeight: 'bold'
      },
      text: "投稿一覧"
    });
    allLabelRow.className = "storedStocks";
    allLabelRow.add(allStockBtn);
    allLabelRow.add(allLabel);
    return allLabelRow;
  };

  menuTable.prototype.makeStockRow = function() {
    var stockBtn, stockLabel, stockRow,
      _this = this;
    stockBtn = Ti.UI.createImageView({
      image: "ui/image/light_list.png",
      left: 5,
      top: 5,
      backgroundColor: "transparent"
    });
    stockLabel = Ti.UI.createLabel(this.fontThemeWhite);
    stockLabel.text = "ストック一覧";
    stockLabel.top = 8;
    stockLabel.left = 35;
    stockRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    stockRow.addEventListener('click', function(e) {});
    stockRow.className = "storedMyStocks";
    stockRow.add(stockBtn);
    stockRow.add(stockLabel);
    return stockRow;
  };

  menuTable.prototype.makeTagRow = function() {
    var tagBtn, tagLabel, tagRow;
    tagRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    tagLabel = Ti.UI.createLabel(this.fontThemeWhite);
    tagLabel.text = "フォローしてるタグ";
    tagLabel.top = 8;
    tagLabel.left = 35;
    tagBtn = Ti.UI.createImageView({
      image: "ui/image/light_tag.png",
      left: 5,
      top: 10,
      backgroundColor: "transparent"
    });
    tagRow.add(tagLabel);
    tagRow.add(tagBtn);
    return tagRow;
  };

  menuTable.prototype.makeFollowerItemsRow = function() {
    var followerItemsBtn, followerItemsLabel, followerItemsRow,
      _this = this;
    followerItemsBtn = Ti.UI.createImageView({
      image: "ui/image/light_pegman---yes@2x.png",
      left: 5,
      top: 5,
      backgroundColor: "transparent"
    });
    followerItemsLabel = Ti.UI.createLabel(this.fontThemeWhite);
    followerItemsLabel.text = "フォロワー投稿";
    followerItemsLabel.top = 8;
    followerItemsLabel.left = 35;
    followerItemsRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    followerItemsRow.addEventListener('click', function(e) {});
    followerItemsRow.className = "followerItems";
    followerItemsRow.add(followerItemsBtn);
    followerItemsRow.add(followerItemsLabel);
    return followerItemsRow;
  };

  menuTable.prototype.resetBackGroundColor = function(menuRows) {
    var menuRow, _i, _len, _results;
    menuRows = this.menuTable.data[0].rows;
    _results = [];
    for (_i = 0, _len = menuRows.length; _i < _len; _i++) {
      menuRow = menuRows[_i];
      if (menuRow.backgroundColor !== this.backgroundColorSub) {
        _results.push(menuRow.backgroundColor = this.backgroundColorSub);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  menuTable.prototype.refreshMenu = function() {
    var Qiita, param, qiita, resetRows, that;
    resetRows = [];
    this.menuTable.setData(resetRows);
    that = this;
    Qiita = require("model/qiita");
    qiita = new Qiita();
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    return qiita._auth(param, function(token) {
      var _this = this;
      Ti.API.debug("token is " + token);
      if (token === null) {
        return alert("ユーザIDかパスワードが間違ってます");
      } else {
        return qiita.getFollowingTags(function(result, links) {
          var json, menuRow, rows, textLabel, _i, _len;
          if (result.length === 0) {
            rows = [that.makeAllLabelRow(), that.makeStockRow()];
          } else {
            rows = [that.makeAllLabelRow(), that.makeStockRow(), that.makeFollowerItemsRow(), that.makeTagRow()];
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              json = result[_i];
              Ti.App.Properties.setString("followingTag" + json.url_name + "nextURL", null);
              menuRow = Ti.UI.createTableViewRow(that.rowColorTheme);
              textLabel = Ti.UI.createLabel({
                width: 255,
                height: 40,
                top: 1,
                left: 20,
                wordWrap: true,
                color: '#fff',
                font: {
                  fontSize: 12,
                  fontWeight: 'bold'
                },
                text: json.name
              });
              menuRow.add(textLabel);
              menuRow.className = "" + json.url_name;
              rows.push(menuRow);
            }
          }
          return that.menuTable.setData(rows);
        });
      }
    });
  };

  return menuTable;

})();

module.exports = menuTable;
