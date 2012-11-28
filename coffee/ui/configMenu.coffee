class configMenu
  constructor: () ->

    groupData = Ti.UI.createTableViewSection
      headerTitle: "アカウント情報"

    row1 = Ti.UI.createTableViewRow
      width: 320
      height:50
      
    sw1 = Ti.UI.createSwitch
      right:10
      value:false
      
    row1.add sw1

    button1 = Ti.UI.createButton
      style:Ti.UI.iPhone.SystemButton.DISCLOSURE
      left:10
      
    row1.add button1
    row1.className = 'control'
    
    groupData.add row1
      
    tableView = Ti.UI.createTableView
      data: [groupData]
      style: Ti.UI.iPhone.TableViewStyle.GROUPED
      top: 50
      width: 320
      
      
    return tableView
    
module.exports = configMenu