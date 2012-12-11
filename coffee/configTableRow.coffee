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
    
    configRows.push row1
    configRows.push row2
    
    return configRows

module.exports = configTableRow