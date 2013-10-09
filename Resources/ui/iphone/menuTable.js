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
      var accountName, className, curretRowIndex, tagName;
      curretRowIndex = e.index;
      className = _this.menuTable.data[0].rows[curretRowIndex].className;
      tagName = _this.menuTable.data[0].rows[curretRowIndex].tagName;
      accountName = _this.menuTable.data[0].rows[curretRowIndex].accountName;
      if (className === "qiitaItems") {
        MainWindow.actInd.show();
        MainWindow.resetSlide();
        MainWindow.setWindowTitle("Qiita:投稿一覧");
        maincontroller.currentPage = "qiitaItems";
        return maincontroller.getFeed();
      } else if (className === "myStocks") {
        MainWindow.actInd.show();
        MainWindow.resetSlide();
        MainWindow.setWindowTitle("Qiita:ストック一覧");
        maincontroller.currentPage = "myStocks";
        return maincontroller.getMyStocks();
      } else if (className === "followerItems") {
        MainWindow.actInd.show();
        MainWindow.resetSlide();
        MainWindow.setWindowTitle("Qiita:フォロワー投稿");
        maincontroller.currentPage = "followerItems";
        return maincontroller.getFollowerItems();
      } else if (className === "tags") {
        MainWindow.actInd.show();
        MainWindow.resetSlide();
        MainWindow.setWindowTitle("Qiita:Tag:" + tagName);
        maincontroller.currentPage = tagName;
        return maincontroller.getFeedByTag(tagName);
      } else if (className === "accountSetting") {
        return configMenu.show(accountName);
      } else if (className === "noevent") {
        return Ti.API.info("no event fired!");
      } else {
        return Ti.API.info("no event fired!");
      }
    });
    rows = [];
    this.makeConfigRow(rows);
    rows.push(this.makeAllLabelRow());
    this.refreshMenu();
    this.menuTable.setData(rows);
    return;
  }

  menuTable.prototype.getMenuTable = function() {
    return this.menuTable;
  };

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
    allLabelRow.className = "qiitaItems";
    allLabelRow.add(allStockBtn);
    allLabelRow.add(allLabel);
    return allLabelRow;
  };

  menuTable.prototype.makeConfigRow = function(rows) {
    var Btn, Label, accountInfo, baseRow, data, iconImage, profileImage, _i, _label, _len, _row;
    accountInfo = [
      {
        name: 'qiita',
        iconImage: 'ui/image/qiita.png'
      }, {
        name: 'hatena',
        iconImage: 'ui/image/hatena.png'
      }, {
        name: 'twitter',
        iconImage: 'ui/image/twitter.png'
      }
    ];
    baseRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    Label = Ti.UI.createLabel(this.fontThemeWhite);
    Label.text = "アカウント設定";
    Label.top = 10;
    Label.left = 35;
    Btn = Ti.UI.createImageView({
      image: "ui/image/light_gear.png",
      left: 5,
      top: 10,
      backgroundColor: "transparent"
    });
    baseRow.add(Label);
    baseRow.add(Btn);
    baseRow.className = 'noevent';
    rows.push(baseRow);
    for (_i = 0, _len = accountInfo.length; _i < _len; _i++) {
      data = accountInfo[_i];
      _row = Ti.UI.createTableViewRow(this.rowColorTheme);
      _row.className = 'accountSetting';
      _row.accountName = data.name;
      profileImage = Ti.App.Properties.getString("" + data.name + "ProfileImageURL");
      Ti.API.info(Ti.App.Properties.getString("hatenaProfileImageURL"));
      if (profileImage === null) {
        iconImage = Ti.UI.createImageView({
          width: 30,
          height: 30,
          top: 5,
          left: 5,
          image: data.iconImage
        });
      } else {
        iconImage = Ti.UI.createImageView({
          width: 30,
          height: 30,
          top: 5,
          left: 5,
          image: profileImage
        });
      }
      _row.add(iconImage);
      _label = Ti.UI.createLabel({
        width: 200,
        height: 40,
        top: 1,
        left: 60,
        color: '#fff',
        font: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        text: data.name
      });
      _row.add(_label);
      rows.push(_row);
    }
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
    stockRow.className = "myStocks";
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
    tagRow.className = 'noevent';
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
        return Ti.API.info("ユーザIDかパスワードが間違ってます");
      } else {
        return qiita.getFollowingTags(function(result, links) {
          var json, menuRow, rows, textLabel, _i, _len;
          rows = [];
          if (result.length === 0) {
            that.makeConfigRow(rows);
            rows.push(that.makeAllLabelRow());
            rows.push(that.makeStockRow());
          } else {
            that.makeConfigRow(rows);
            rows.push(that.makeAllLabelRow());
            rows.push(that.makeStockRow());
            rows.push(that.makeFollowerItemsRow());
            rows.push(that.makeTagRow());
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
              menuRow.className = "tags";
              menuRow.tagName = "" + json.url_name;
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
