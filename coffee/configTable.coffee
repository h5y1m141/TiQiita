class configTable
  constructor: () ->
    backgroundColorBase = '#ededed'

    fontTheme =
      top: 5
      left: 5
      color: "#333"
      font:
        fontSize: 12
        fontWeight: "bold"

    
    table = Ti.UI.createTableView
      backgroundColor:backgroundColorBase
      separatorStyle:1
      separatorColor:backgroundColorBase
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      zIndex:1
      width:160
      left:0
      top:0
      
    configAccountLabel = Ti.UI.createLabel(fontTheme)
    configAccountLabel.text = "アカウント設定"
    configAccountLabel.top = 8
    configAccountLabel.left = 35

    configTitleRow = Ti.UI.createTableViewRow
      width: 158
      height:40
      left:1
      backgroundColor:backgroundColorSub

    configTitleRow.add configBtn
    configTitleRow.add configAccountLabel
    configRows.push configTitleRow
      
    return table  

module.exports = configTable