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
      stockLabel.text = "ストック投稿を見る";
      stockLabel.top = 8;
      stockLabel.left = 35;
      stockRow = Ti.UI.createTableViewRow(rowColorTheme);
      stockRow.addEventListener('click', function(e) {
        return slideEvent();
      });
      stockRow.className = "stock";
      stockRow.add(stockBtn);
      stockRow.add(stockLabel);
      return stockRow;
    };
    makeTagRow = function() {
      var tagBtn, tagLabel, tagRow;
      tagRow = Ti.UI.createTableViewRow(rowColorTheme);
      tagLabel = Ti.UI.createLabel(fontThemeWhite);
      tagLabel.text = "タグを見る";
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
      var i, tags, value, _, _i, _ref;
      for (i = _i = 0, _ref = items.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        tags = items[i].tags;
        _ = require("lib/underscore-min");
        value = _.where(tags, {
          "url_name": tagName
        });
        if (value.length !== 0) {
          return t.createRow(items[i]);
        }
      }
    };
    slideEvent = function() {
      Ti.App.Properties.setBool("stateMainTableSlide", true);
      return controller.slideMainTable();
    };
    resetBackGroundColor = function(menuRows) {
      var menuRow, _i, _len, _results;
      menuRows = table.data[0].rows;
      _results = [];
      for (_i = 0, _len = menuRows.length; _i < _len; _i++) {
        menuRow = menuRows[_i];
        if (menuRow.backgroundColor !== backgroundColorSub) {
          _results.push(menuRow.backgroundColor = backgroundColorSub);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    table.addEventListener('click', function(e) {
      var allLabelIndexPosition, configIndexPosition, configRow, configTableRow, curretRowIndex, items, json, result, stockIndexPosition, tagName, _i, _j, _len, _len1;
      curretRowIndex = e.index;
      resetBackGroundColor(table.data[0].rows);
      table.data[0].rows[curretRowIndex].backgroundColor = qiitaColor;
      items = JSON.parse(Ti.App.Properties.getString('storedStocks'));
      result = [];
      configIndexPosition = 0;
      stockIndexPosition = 1;
      allLabelIndexPosition = 3;
      switch (table.data[0].rows[curretRowIndex].className) {
        case "config":
          Ti.API.info("CONDITION CONFIG");
          configTableRow = require("configTableRow");
          configRow = new configTableRow;
          result = configRow;
          break;
        case "stock":
          Ti.API.info("CONDITION STOCK");
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            json = items[_i];
            result.push(t.createRow(json));
          }
          break;
        case "allLabel":
          Ti.API.info("CONDITION ALL");
          for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
            json = items[_j];
            result.push(t.createRow(json));
          }
          result.push(t.createRowForLoadOldEntry());
          break;
        default:
          tagName = e.rowData.className;
          result.push(matchTag(items, tagName));
      }
      return mainTable.setData(result);
    });
    qiita.getFollowingTags(function(result, links) {
      var allLabel, allLabelRow, json, menuRow, rows, textLabel, _i, _len;
      rows = [makeConfigRow(), makeStockRow(), makeTagRow()];
      allLabelRow = Ti.UI.createTableViewRow(rowColorTheme);
      allLabelRow.backgroundColor = qiitaColor;
      allLabelRow.selectedBackgroundColor = backgroundColorSub;
      allLabelRow.addEventListener('click', function(e) {
        return slideEvent();
      });
      allLabel = Ti.UI.createLabel({
        width: 158,
        height: 40,
        top: 0,
        left: 0,
        wordWrap: true,
        color: '#fff',
        font: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        text: "ALL"
      });
      allLabelRow.className = "allLabel";
      allLabelRow.add(allLabel);
      rows.push(allLabelRow);
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        menuRow = Ti.UI.createTableViewRow(rowColorTheme);
        menuRow.addEventListener('click', function(e) {
          e.row.backgroundColor = qiitaColor;
          return slideEvent();
        });
        textLabel = Ti.UI.createLabel({
          width: 150,
          height: 40,
          top: 1,
          left: 0,
          wordWrap: true,
          color: '#fff',
          font: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          text: json.url_name
        });
        menuRow.add(textLabel);
        menuRow.className = json.url_name;
        rows.push(menuRow);
      }
      return table.setData(rows);
    });
    return table;
  }

  return menuTable;

})();

module.exports = menuTable;
