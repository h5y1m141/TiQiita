var menuTable;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
menuTable = (function() {
  function menuTable() {
    var backgroundColorBase, rows;
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
    this.table.addEventListener('click', __bind(function(e) {
      var curretRowIndex;
      curretRowIndex = e.index;
      this.resetBackGroundColor(this.table.data[0].rows);
      this.table.data[0].rows[curretRowIndex].backgroundColor = this.qiitaColor;
      return controller.selectMenu(this.table.data[0].rows[curretRowIndex].className);
    }, this));
    rows = [this.makeAllLabelRow(), this.makeConfigRow()];
    this.table.setData(rows);
  }
  menuTable.prototype.getMenu = function() {
    return this.table;
  };
  menuTable.prototype.makeAllLabelRow = function() {
    var allLabel, allLabelRow, allStockBtn;
    allLabelRow = Ti.UI.createTableViewRow(this.rowColorTheme);
    allLabelRow.backgroundColor = this.qiitaColor;
    allLabelRow.selectedBackgroundColor = this.backgroundColorSub;
    allLabelRow.addEventListener('click', __bind(function(e) {
      return this.slideEvent(e.rowData.className);
    }, this));
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
    var configAccountLabel, configBtn, configRow;
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
    configRow.addEventListener('click', __bind(function(e) {
      return this.slideEvent(e.rowData.className);
    }, this));
    configRow.className = "config";
    configRow.add(configBtn);
    configRow.add(configAccountLabel);
    return configRow;
  };
  menuTable.prototype.makeStockRow = function() {
    var stockBtn, stockLabel, stockRow;
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
    stockRow.addEventListener('click', __bind(function(e) {
      return this.slideEvent(e.rowData.className);
    }, this));
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
    var i, tags, value, _, _ref;
    for (i = 0, _ref = items.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
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
    return controller.slideMainTable(direction);
  };
  menuTable.prototype.resetBackGroundColor = function(menuRows) {
    var menuRow, _i, _len, _results;
    menuRows = this.table.data[0].rows;
    _results = [];
    for (_i = 0, _len = menuRows.length; _i < _len; _i++) {
      menuRow = menuRows[_i];
      _results.push(menuRow.backgroundColor !== this.backgroundColorSub ? menuRow.backgroundColor = this.backgroundColorSub : void 0);
    }
    return _results;
  };
  menuTable.prototype.refreshMenu = function() {
    return qiita.getFollowingTags(__bind(function(result, links) {
      var followingTags, json, menuRow, rows, textLabel, _i, _len;
      Ti.API.info(result);
      if (result.length === 0) {
        rows = [this.makeAllLabelRow(), this.makeStockRow(), this.makeConfigRow()];
        return this.table.setData(rows);
      } else {
        rows = [this.makeAllLabelRow(), this.makeStockRow(), this.makeTagRow()];
        followingTags = [];
        for (_i = 0, _len = result.length; _i < _len; _i++) {
          json = result[_i];
          menuRow = Ti.UI.createTableViewRow(this.rowColorTheme);
          followingTags.push(json.url_name);
          menuRow.addEventListener('click', function(e) {
            e.row.backgroundColor = this.qiitaColor;
            return this.slideEvent(e.rowData.className);
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
        rows.push(this.makeConfigRow());
        return this.table.setData(rows);
      }
    }, this));
  };
  return menuTable;
})();
module.exports = menuTable;