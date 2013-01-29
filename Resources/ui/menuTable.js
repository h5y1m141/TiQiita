var menuTable;
menuTable = (function() {
  function menuTable() {
    var backgroundColorBase, backgroundColorForTags, backgroundColorSub, fontThemeWhite, makeConfigRow, makeStockRow, makeTagRow, matchTag, qiitaColor, resetBackGroundColor, rowColorTheme, slideEvent, table;
    backgroundColorBase = '#222';
    backgroundColorSub = '#333';
    backgroundColorForTags = '#444';
    qiitaColor = '#59BB0C';
    fontThemeWhite = {
      top: 5,
      left: 5,
      color: "#fff",
      font: {
        fontSize: 12,
        fontWeight: "bold"
      }
    };
    rowColorTheme = {
      width: 158,
      left: 1,
      opacity: 0.8,
      borderColor: '#ededed',
      height: 40,
      backgroundColor: backgroundColorSub,
      selectedBackgroundColor: qiitaColor
    };
    table = Ti.UI.createTableView({
      backgroundColor: backgroundColorBase,
      separatorStyle: 1,
      separatorColor: backgroundColorBase,
      zIndex: 1,
      width: 160,
      left: 0,
      top: 0
    });
    makeConfigRow = function() {
      var configAccountLabel, configBtn, configRow;
      configBtn = Ti.UI.createImageView({
        image: "ui/image/light_gear.png",
        left: 5,
        top: 5,
        backgroundColor: "transparent"
      });
      configAccountLabel = Ti.UI.createLabel(fontThemeWhite);
      configAccountLabel.text = "アカウント設定";
      configAccountLabel.top = 8;
      configAccountLabel.left = 35;
      configRow = Ti.UI.createTableViewRow(rowColorTheme);
      configRow.addEventListener('click', function(e) {
        return slideEvent();
      });
      configRow.className = "config";
      configRow.add(configBtn);
      configRow.add(configAccountLabel);
      return configRow;
    };
    makeStockRow = function() {
      var stockBtn, stockLabel, stockRow;
      stockBtn = Ti.UI.createImageView({
        image: "ui/image/light_list.png",
        left: 5,
        top: 5,
        backgroundColor: "transparent"
      });
      stockLabel = Ti.UI.createLabel(fontThemeWhite);
      stockLabel.text = "ストック一覧";
      stockLabel.top = 8;
      stockLabel.left = 35;
      stockRow = Ti.UI.createTableViewRow(rowColorTheme);
      stockRow.addEventListener('click', function(e) {
        return slideEvent();
      });
      stockRow.className = "storedMyStocks";
      stockRow.add(stockBtn);
      stockRow.add(stockLabel);
      return stockRow;
    };
    makeTagRow = function() {
      var tagBtn, tagLabel, tagRow;
      tagRow = Ti.UI.createTableViewRow(rowColorTheme);
      tagLabel = Ti.UI.createLabel(fontThemeWhite);
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
    matchTag = function(items, tagName) {
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
    slideEvent = function(currentMenu) {
      var direction;
      Ti.App.Properties.setBool("stateMainTableSlide", true);
      direction = "horizontal";
      return controller.slideMainTable(direction);
    };
    resetBackGroundColor = function(menuRows) {
      var menuRow, _i, _len, _results;
      menuRows = table.data[0].rows;
      _results = [];
      for (_i = 0, _len = menuRows.length; _i < _len; _i++) {
        menuRow = menuRows[_i];
        _results.push(menuRow.backgroundColor !== backgroundColorSub ? menuRow.backgroundColor = backgroundColorSub : void 0);
      }
      return _results;
    };
    table.addEventListener('click', function(e) {
      var curretRowIndex;
      curretRowIndex = e.index;
      resetBackGroundColor(table.data[0].rows);
      table.data[0].rows[curretRowIndex].backgroundColor = qiitaColor;
      return controller.selectMenu(table.data[0].rows[curretRowIndex].className);
    });
    qiita.getFollowingTags(function(result, links) {
      var allLabel, allLabelRow, allStockBtn, followinTags, json, menuRow, rows, textLabel, _i, _len;
      allLabelRow = Ti.UI.createTableViewRow(rowColorTheme);
      allLabelRow.backgroundColor = qiitaColor;
      allLabelRow.selectedBackgroundColor = backgroundColorSub;
      allLabelRow.addEventListener('click', function(e) {
        return slideEvent();
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
      rows = [allLabelRow, makeStockRow(), makeTagRow()];
      followinTags = [];
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        menuRow = Ti.UI.createTableViewRow(rowColorTheme);
        followinTags.push(json.url_name);
        menuRow.addEventListener('click', function(e) {
          e.row.backgroundColor = qiitaColor;
          return slideEvent();
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
        menuRow.className = "followinTag" + json.url_name;
        rows.push(menuRow);
      }
      rows.push(makeConfigRow());
      return table.setData(rows);
    });
    return table;
  }
  return menuTable;
})();
module.exports = menuTable;