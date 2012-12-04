var menuTable;

menuTable = (function() {

  function menuTable() {
    var backgroundColorBase, backgroundColorSub, fontThemeWhite, makeConfigSection, slideEvent, table;
    backgroundColorBase = '#222';
    backgroundColorSub = '#333';
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
      separatorStyle: 0,
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
        width: 320,
        height: 30,
        backgroundColor: backgroundColorSub
      });
      configTitleRow.add(configBtn);
      configTitleRow.add(configAccountLabel);
      configRows.push(configTitleRow);
      return configRows;
    };
    slideEvent = function() {
      Ti.App.Properties.setBool("stateMainTableSlide", true);
      return controller.slideMainTable();
    };
    table.addEventListener('click', function(e) {
      var curretRowIndex, i, items, json, menuRow, menuRows, result, tagName, tags, value, _, _i, _j, _k, _len, _len1, _ref;
      curretRowIndex = e.index;
      menuRows = table.data[0].rows;
      for (_i = 0, _len = menuRows.length; _i < _len; _i++) {
        menuRow = menuRows[_i];
        if (menuRow.backgroundColor !== '#222') {
          menuRow.backgroundColor = '#222';
        }
      }
      table.data[0].rows[curretRowIndex].backgroundColor = '#59BB0C';
      items = JSON.parse(Ti.App.Properties.getString('storedStocks'));
      result = [];
      if (curretRowIndex === 0) {
        for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
          json = items[_j];
          result.push(t.createRow(json));
        }
      } else {
        for (i = _k = 0, _ref = items.length - 1; 0 <= _ref ? _k <= _ref : _k >= _ref; i = 0 <= _ref ? ++_k : --_k) {
          tags = items[i].tags;
          _ = require("lib/underscore-min");
          tagName = e.rowData.className;
          value = _.where(tags, {
            "url_name": tagName
          });
          if (value.length !== 0) {
            result.push(t.createRow(items[i]));
          }
        }
      }
      if (table.data[0].rows[curretRowIndex].className === "allLabel") {
        result.push(t.createRowForLoadOldEntry());
      }
      return mainTable.setData(result);
    });
    qiita.getFollowingTags(function(result, links) {
      var allLabel, allLabelRow, configRows, json, menuRow, tagsSection, textLabel, _i, _len;
      configRows = makeConfigSection();
      tagsSection = Ti.UI.createTableViewSection({
        headerTitle: "タグ一覧",
        color: "#fff"
      });
      allLabelRow = Ti.UI.createTableViewRow({
        width: 160,
        opacity: 0.8,
        backgroundColor: '#59BB0C',
        selectedBackgroundColor: '#222',
        borderColor: '#ededed',
        height: 40
      });
      allLabelRow.addEventListener('click', function(e) {
        return slideEvent();
      });
      allLabel = Ti.UI.createLabel({
        width: 160,
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
      tagsSection.add(allLabelRow);
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        menuRow = Ti.UI.createTableViewRow({
          width: 160,
          opacity: 0.8,
          backgroundColor: '#333',
          selectedBackgroundColor: '#59BB0C',
          borderColor: '#ededed',
          height: 40
        });
        menuRow.addEventListener('click', function(e) {
          e.row.backgroundColor = '#59BB0C';
          return slideEvent();
        });
        textLabel = Ti.UI.createLabel({
          width: 160,
          height: 40,
          top: 0,
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
        tagsSection.add(menuRow);
      }
      return table.data = configRows;
    });
    return table;
  }

  return menuTable;

})();

module.exports = menuTable;
