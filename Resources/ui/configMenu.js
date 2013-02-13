var configMenu;
configMenu = (function() {
  function configMenu() {
    var QiitaLoginID, QiitaLoginPassword, groupData, label1, label2, row1, row2, tableView, textField1, textField2;
    groupData = Ti.UI.createTableViewSection();
    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');
    QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');
    row1 = Ti.UI.createTableViewRow({
      width: 320,
      height: 50
    });
    label1 = Ti.UI.createLabel({
      color: "#222",
      top: 5,
      left: 5,
      width: 100,
      height: 40,
      text: "ログインID"
    });
    textField1 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 110,
      width: 150,
      height: 40,
      hintText: "ユーザID",
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
    row1.add(label1);
    row1.add(textField1);
    row1.className = 'url_name';
    row2 = Ti.UI.createTableViewRow({
      width: 320,
      height: 50
    });
    label2 = Ti.UI.createLabel({
      color: "#222",
      top: 5,
      left: 5,
      width: 100,
      height: 40,
      text: "パスワード"
    });
    textField2 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 110,
      width: 150,
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
    textField2.addEventListener('blur', function(e) {
      var message;
      if (controller.networkStatus() === false) {
        message = mainContoroller.networkDisconnectedMessage;
        return mainContoroller._alertViewShow(message);
      } else {
        actInd.show();
        return commandController.useMenu("qiitaLogin");
      }
    });
    row2.add(label2);
    row2.add(textField2);
    row2.className = 'password';
    if (QiitaLoginID !== null) {
      textField1.value = QiitaLoginID;
    }
    if (QiitaLoginPassword !== null) {
      textField2.value = QiitaLoginPassword;
    }
    groupData.add(row1);
    groupData.add(row2);
    tableView = Ti.UI.createTableView({
      zIndex: 5,
      data: [groupData],
      style: Ti.UI.iPhone.TableViewStyle.GROUPED,
      top: 0,
      width: 320,
      height: 160
    });
    return tableView;
  }
  return configMenu;
})();
module.exports = configMenu;