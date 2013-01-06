
describe('tableView取得', function() {
  beforeEach(function() {
    var tableView;
    tableView = require('tableView');
    return this.mainTable = new tableView();
  });
  it('tableView背景色が確認出来る', function() {
    var t;
    t = this.mainTable.getTable();
    return expect(t.backgroundColor).toBe('#ededed');
  });
  return it('tableView背景色が確認出来る', function() {
    var dummy, row;
    dummy = {
      created_at: "sample",
      title: "sample",
      body: "<html>sample</html>",
      tags: {
        url_name: "ruby"
      },
      user: {
        profile_image_url: "http://qiita.com",
        url_name: "sample"
      }
    };
    row = this.mainTable.createRow(dummy);
    return expect(row).toBe("Ti.UI.Row");
  });
});
