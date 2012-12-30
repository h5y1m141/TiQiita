class configTableRow
  constructor: () ->
    baseColor = '#ededed'
    qiitaColor = '#4BA503'

    rowTheme =
      width: 300
      height:80

      backgroundColor:baseColor

    labelTheme =
      top: 5
      left: 5
      width:250
      height:30
      color: "#222"
      font:
        fontSize: 14
        fontWeight: "bold"
        
    fieldTheme =
      top: 40
      left: 5
      width:250
      height:30
      color: "#222"
      font:
        fontSize: 12
        fontWeight: "bold"
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED


    configRows = []
    row1 = Ti.UI.createTableViewRow(rowTheme)
    row2 = Ti.UI.createTableViewRow(rowTheme)
    row3 = Ti.UI.createTableViewRow(rowTheme)
    
    accountLabel = Ti.UI.createLabel(labelTheme)
    accountLabel.text = "アカウント名"
    accountField = Ti.UI.createTextField(fieldTheme)
    accountField.passwordMask = false
    accountField.hintText = "Qiitaログインアカウント入力"
    row1.add accountLabel
    row1.add accountField

    passwordLabel = Ti.UI.createLabel(labelTheme)
    passwordLabel.text = "パスワード"
    passwordField = Ti.UI.createTextField(fieldTheme)
    passwordField.passwordMask = true
    passwordField.hintText = "パスワード入力"
    row2.add passwordLabel
    row2.add passwordField

    loginBtn = Ti.UI.createButton
      width:100
      height:30
      left:50
      top:20
      title:'login'

    loginBtn.addEventListener('click',(e) ->
      controller.login e.rowData
    )      
      
    logoutBtn = Ti.UI.createButton
      width:100
      height:30
      left:160
      top:20
      title:'logout'
      
    logoutBtn.addEventListener('click',() ->
      controller.logout()
      
    )      
      
      
    row3.add loginBtn      
    row3.add logoutBtn

    row1.className = 'config'
    row2.className = 'config'
    row3.className = 'config'        
    
    configRows.push row1
    configRows.push row2
    configRows.push row3    
    
    return configRows

module.exports = configTableRow