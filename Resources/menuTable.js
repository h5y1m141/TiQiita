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
      var curretRowIndex, i, menuRow, menuRows, numberOfRows, result, tagName, tags, value, _, _i, _j, _len;
      curretRowIndex = e.index;
      menuRows = table.data[0].rows;
      for (_i = 0, _len = menuRows.length; _i < _len; _i++) {
        menuRow = menuRows[_i];
        if (menuRow.backgroundColor !== '#222') {
          menuRow.backgroundColor = '#222';
        }
      }
      table.data[0].rows[curretRowIndex].backgroundColor = '#59BB0C';
      numberOfRows = mainTable.data[0].rows.length - 1;
      result = [];
      for (i = _j = 0; 0 <= numberOfRows ? _j <= numberOfRows : _j >= numberOfRows; i = 0 <= numberOfRows ? ++_j : --_j) {
        tags = mainTable.data[0].rows[i].tags;
        _ = require("lib/underscore-min");
        tagName = e.rowData.className;
        value = _.where(tags, {
          "url_name": tagName
        });
        if (value.length !== 0) {
          result.push(value);
        }
      }
      return Ti.API.info("#value is:" + result);
    });
    qiita.getFollowingTags(function(result, links) {
      var json, menuRow, menuRows, textLabel, _i, _len;
      menuRows = [];
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
