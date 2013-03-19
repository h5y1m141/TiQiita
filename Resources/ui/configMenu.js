var configMenu;

configMenu = (function() {

  function configMenu() {
    var QiitaLoginID, QiitaLoginPassword, groupData, loginGroup, row1, row2, row3, row3label, tableView, textField1, textField2;
    groupData = Ti.UI.createTableViewSection({
      headerTitle: "Qiitaアカウント設定"
    });
    commandController.createMenu();
    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');
    QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');
    row1 = Ti.UI.createTableViewRow({
      width: 270,
      height: 50
    });
    textField1 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 10,
      width: 230,
      height: 40,
      hintText: "QiitaユーザID",
      font: {
        fontSize: 14
      },
      keyboardType: Ti.UI.KEYBOARD_EMAIL_ADDRESS,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      autocorrect: false,
      autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    });
    textField1.addEventListener('change', function(e) {
      return Ti.App.Properties.setString('QiitaLoginID', e.value);
    });
    row1.add(textField1);
    row1.className = 'url_name';
    row2 = Ti.UI.createTableViewRow({
      width: 270,
      height: 50
    });
    textField2 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 10,
      width: 230,
      height: 40,
      hintText: "パスワード入力",
      font: {
        fontSize: 14
      },
      keyboardType: Ti.UI.KEYBOARD_ASCII,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      enableReturnKey: true,
      passwordMask: true,
      autocorrect: false
    });
    textField2.addEventListener('change', function(e) {
      return Ti.App.Properties.setString('QiitaLoginPassword', e.value);
    });
    row2.add(textField2);
    row2.className = 'password';
    if (QiitaLoginID !== null) {
      textField1.value = QiitaLoginID;
    }
    if (QiitaLoginPassword !== null) {
      textField2.value = QiitaLoginPassword;
    }
    row3 = Ti.UI.createTableViewRow({
      width: 270,
      height: 50,
      backgroundColor: '#59BB0C'
    });
    row3label = Ti.UI.createLabel({
      color: "#fff",
      top: 15,
      left: 5,
      width: 250,
      height: 20,
      font: {
        fontSize: 20,
        fontWeight: 'bold'
      },
      textAlign: 1,
      text: "ログインする"
    });
    row3.add(row3label);
    groupData.add(row1);
    groupData.add(row2);
    groupData.add(row3);
    loginGroup = Ti.UI.createTableViewSection();
    tableView = Ti.UI.createTableView({
      zIndex: 5,
      data: [groupData],
      style: Ti.UI.iPhone.TableViewStyle.GROUPED,
      top: 0,
      left: 50,
      width: 270,
      height: 300
    });
    tableView.addEventListener('click', function(e) {
      if (e.index === 2) {
        return commandController.useMenu("qiitaLogin");
      }
    });
    return tableView;
  }

  return configMenu;

})();

module.exports = configMenu;
