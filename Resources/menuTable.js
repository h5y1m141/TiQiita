var menuTable;

menuTable = (function() {

  function menuTable() {
    var table;
    table = Ti.UI.createTableView({
      backgroundColor: '#222',
      separatorStyle: 0,
      zIndex: 1,
      width: 80,
      left: 0,
      top: 0
    });
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
      var allLabel, allLabelRow, json, menuRow, menuRows, textLabel, _i, _len;
      menuRows = [];
      allLabelRow = Ti.UI.createTableViewRow({
        width: 80,
        opacity: 0.8,
        backgroundColor: '#59BB0C',
        selectedBackgroundColor: '#222',
        borderColor: '#ededed',
        height: 60
      });
      allLabel = Ti.UI.createLabel({
        width: 80,
        height: 60,
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
      menuRows.push(allLabelRow);
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        menuRow = Ti.UI.createTableViewRow({
          width: 80,
          opacity: 0.8,
          backgroundColor: '#222',
          selectedBackgroundColor: '#59BB0C',
          borderColor: '#ededed',
          height: 60
        });
        menuRow.addEventListener('click', function(e) {
          return e.row.backgroundColor = '#59BB0C';
        });
        textLabel = Ti.UI.createLabel({
          width: 80,
          height: 60,
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
        menuRows.push(menuRow);
      }
      return table.setData(menuRows);
    });
    return table;
  }

  return menuTable;

})();

module.exports = menuTable;
