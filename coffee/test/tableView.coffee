describe 'tableView取得', ->
  beforeEach ->
    tableView = require('tableView')
    @mainTable = new tableView()
    
  it 'tableView背景色が確認出来る',() ->
    t = @mainTable.getTable()
    expect(t.backgroundColor).toBe '#ededed'

  it 'tableView背景色が確認出来る',() ->

    dummy =
      created_at:"sample"
      title:"sample"
      body:"<html>sample</html>"
      tags:
        url_name:"ruby"
      user:
        profile_image_url:"http://qiita.com"
        url_name:"sample"
      
    row = @mainTable.createRow dummy
    expect(row).toBe "Ti.UI.Row"