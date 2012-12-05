var menuTable;

menuTable = (function() {

  function menuTable() {
    var backgroundColorBase, backgroundColorForTags, backgroundColorSub, fontThemeWhite, makeConfigSection, matchTag, resetBackGroundColor, slideEvent, table;
    backgroundColorBase = '#222';
    backgroundColorSub = '#333';
    backgroundColorForTags = '#444';
    fontThemeWhite = {
      top: 5,
      left: 5,
      color: "#fff",
      font: {
        fontSize: 12,
        fontWeight: "bold"
      }
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
    makeConfigSection = function() {
      var configAccountLabel, configBtn, configRows, configTitleRow;
      configRows = [];
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
      configTitleRow = Ti.UI.createTableViewRow({
        width: 158,
        height: 40,
        left: 1,
        backgroundColor: backgroundColorSub
      });
      configTitleRow.add(configBtn);
      configTitleRow.add(configAccountLabel);
      configRows.push(configTitleRow);
      return configRows;
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
      var allLabelIndexPosition, curretRowIndex, items, json, result, _i, _len;
      curretRowIndex = e.index;
      resetBackGroundColor(table.data[0].rows);
      table.data[0].rows[curretRowIndex].backgroundColor = '#59BB0C';
      items = JSON.parse(Ti.App.Properties.getString('storedStocks'));
      result = [];
      allLabelIndexPosition = 3;
      if (curretRowIndex === allLabelIndexPosition) {
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          json = items[_i];
          result.push(t.createRow(json));
        }
      } else {
        result.push(matchTag(items, e.rowData.className));
      }
      if (table.data[0].rows[curretRowIndex].className === "allLabel") {
        result.push(t.createRowForLoadOldEntry());
      }
      return mainTable.setData(result);
    });
    qiita.getFollowingTags(function(result, links) {
      var allLabel, allLabelRow, configRows, json, menuRow, stockBtn, stockLabel, stockRow, tagBtn, tagLabel, tagRow, textLabel, _i, _len;
      configRows = makeConfigSection();
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
      stockRow = Ti.UI.createTableViewRow({
        width: 158,
        height: 40,
        left: 1,
        backgroundColor: backgroundColorSub
      });
      stockRow.add(stockBtn);
      stockRow.add(stockLabel);
      configRows.push(stockRow);
      tagRow = Ti.UI.createTableViewRow({
        width: 158,
        height: 40,
        left: 1,
        backgroundColor: backgroundColorSub
      });
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
      configRows.push(tagRow);
      allLabelRow = Ti.UI.createTableViewRow({
        width: 158,
        left: 1,
        opacity: 0.8,
        backgroundColor: '#59BB0C',
        selectedBackgroundColor: backgroundColorSub,
        borderColor: '#ededed',
        height: 40
      });
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
      configRows.push(allLabelRow);
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        menuRow = Ti.UI.createTableViewRow({
          width: 158,
          left: 1,
          opacity: 0.8,
          backgroundColor: backgroundColorSub,
          selectedBackgroundColor: '#59BB0C',
          borderColor: '#ededed',
          height: 40
        });
        menuRow.addEventListener('click', function(e) {
          e.row.backgroundColor = '#59BB0C';
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
        configRows.push(menuRow);
      }
      return table.data = configRows;
    });
    return table;
  }

  return menuTable;

})();

module.exports = menuTable;
