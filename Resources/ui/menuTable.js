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
      width: 158,
      left: 1,
      opacity: 0.8,
      borderColor: '#ededed',
      height: 40,
      backgroundColor: this.backgroundColorSub,
      selectedBackgroundColor: this.qiitaColor
    };
    this.table = Ti.UI.createTableView({
      backgroundColor: backgroundColorBase,
      separatorStyle: 1,
      separatorColor: backgroundColorBase,
      zIndex: 1,
      width: 160,
      left: 0,
      top: 0
    });
    this.table.addEventListener('click', function(e) {
      var curretRowIndex;
      curretRowIndex = e.index;
      _this.resetBackGroundColor(_this.table.data[0].rows);
      _this.table.data[0].rows[curretRowIndex].backgroundColor = _this.qiitaColor;
      return mainContoroller.selectMenu(_this.table.data[0].rows[curretRowIndex].className);
    });
    rows = [this.makeAllLabelRow()];
    this.table.setData(rows);
  }

  menuTable.prototype.getMenu = function() {
    return this.table;
  };

  menuTable.prototype.makeAllLabelRow = function() {
    var allLabel, allLabelRow, allStockBtn,
      _this = this;
    allLabelRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    allLabelRow.backgroundColor = this.qiitaColor;
    allLabelRow.selectedBackgroundColor = this.backgroundColorSub;
    allLabelRow.addEventListener('click', function(e) {
      return _this.slideEvent(e.rowData.className);
    });
    allStockBtn = Ti.UI.createImageView({
      image: "ui/image/light_list.png",
      left: 5,
      top: 8,
      backgroundColor: "transparent"
    });
    allLabel = Ti.UI.createLabel({
      width: 158,
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

  menuTable.prototype.makeConfigRow = function() {
    var configAccountLabel, configBtn, configRow,
      _this = this;
    configRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    configBtn = Ti.UI.createImageView({
      image: "ui/image/light_gear.png",
      left: 5,
      top: 5,
      backgroundColor: "transparent"
    });
    configAccountLabel = Ti.UI.createLabel(this.fontThemeWhite);
    configAccountLabel.text = "アカウント設定";
    configAccountLabel.top = 8;
    configAccountLabel.left = 35;
    configRow.addEventListener('click', function(e) {
      return _this.slideEvent(e.rowData.className);
    });
    configRow.className = "config";
    configRow.add(configBtn);
    configRow.add(configAccountLabel);
    return configRow;
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
    stockRow.addEventListener('click', function(e) {
      return _this.slideEvent(e.rowData.className);
    });
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

  menuTable.prototype.matchTag = function(items, tagName) {
    var i, tags, value, _, _i, _ref;
    for (i = _i = 0, _ref = items.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      tags = items[i].tags;
      _ = require("lib/underscore-min");
      value = _.where(tags, {
        "name": tagName
      });
      Ti.API.info("tags is " + tags + " matchTag .tagName is " + tagName + " value is " + value);
      if (value.length !== 0) {
        return t.createRow(items[i]);
      }
    }
  };

  menuTable.prototype.slideEvent = function(storedTo) {
    var direction;
    Ti.App.Properties.setBool("stateMainTableSlide", true);
    Ti.App.Properties.setString("currentPage", storedTo);
    direction = "horizontal";
    return mainContoroller.slideMainTable(direction);
  };

  menuTable.prototype.resetBackGroundColor = function(menuRows) {
    var menuRow, _i, _len, _results;
    menuRows = this.table.data[0].rows;
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
    var _this = this;
    return qiita.getFollowingTags(function(result, links) {
      var errorFlg, followingTags, json, menuRow, rows, textLabel, _i, _len;
      errorFlg = Ti.App.Properties.getBool("followingTagsError");
      if (result.length === 0 || errorFlg === true) {
        rows = [_this.makeAllLabelRow(), _this.makeStockRow()];
        return _this.table.setData(rows);
      } else {
        rows = [_this.makeAllLabelRow(), _this.makeStockRow(), _this.makeTagRow()];
        followingTags = [];
        for (_i = 0, _len = result.length; _i < _len; _i++) {
          json = result[_i];
          menuRow = Ti.UI.createTableViewRow(_this.rowColorTheme);
          followingTags.push(json.url_name);
          menuRow.addEventListener('click', function(e) {
            e.row.backgroundColor = _this.qiitaColor;
            return _this.slideEvent(e.rowData.className);
          });
          textLabel = Ti.UI.createLabel({
            width: 150,
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
          menuRow.className = "followingTag" + json.url_name;
          rows.push(menuRow);
        }
        return _this.table.setData(rows);
      }
    });
  };

  return menuTable;

})();

module.exports = menuTable;
