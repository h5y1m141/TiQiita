var configMenu;

configMenu = (function() {

  function configMenu() {
    var QiitaLoginID, QiitaLoginPassword, groupData, hatenaIconImage, platformSection, row1, row2, row3, row3label, textField1, textField2;
    groupData = Ti.UI.createTableViewSection({
      headerTitle: "Qiitaアカウント設定"
    });
    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');
    QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');
    row1 = Ti.UI.createTableViewRow({
      width: 270,
      height: Ti.UI.FILL
    });
    textField1 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 10,
      width: 230,
      height: 30,
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
      height: Ti.UI.FILL
    });
    textField2 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 10,
      width: 230,
      height: 30,
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
    platformSection = Ti.UI.createTableViewSection({
      headerTitle: "SNSアカウント設定"
    });
    this.hatenaRow = Ti.UI.createTableViewRow({
      touchEnabled: false,
      height: Ti.UI.FILL,
      selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
    });
    this.hatenaRow.addEventListener('click', function() {});
    hatenaIconImage = Ti.UI.createImageView({
      width: 35,
      height: 35,
      top: 5,
      left: 5,
      image: "ui/image/hatena.png"
    });
    this.hatenaLabel = Ti.UI.createLabel({
      left: 50,
      width: 100,
      text: "はてな"
    });
    if (Ti.App.Properties.getBool("hatenaAccessTokenKey") != null) {
      this.hatenaSwitch = Ti.UI.createSwitch({
        right: 10,
        value: true
      });
    } else {
      this.hatenaSwitch = Ti.UI.createSwitch({
        right: 10,
        value: false
      });
    }
    this.hatenaSwitch.addEventListener("change", function(e) {
      var Hatena, hatena;
      if (e.value === true) {
        Hatena = require("model/hatena");
        hatena = new Hatena();
        return hatena.login();
      } else {
        Ti.App.Properties.removeProperty("hatenaAccessTokenKey");
        return Ti.App.Properties.removeProperty("hatenaAccessTokenSecret");
      }
    });
    this.hatenaRow.add(hatenaIconImage);
    this.hatenaRow.add(this.hatenaLabel);
    this.hatenaRow.add(this.hatenaSwitch);
    platformSection.add(this.hatenaRow);
    this.tableView = Ti.UI.createTableView({
      zIndex: 5,
      data: [groupData, platformSection],
      style: Ti.UI.iPhone.TableViewStyle.GROUPED,
      top: 0,
      left: 50,
      width: 270,
      height: 'auto'
    });
    this.tableView.addEventListener('click', function(e) {
      var LoginCommand, loginCommand;
      if (e.index === 2) {
        textField2.enabled = false;
        actInd.show();
        LoginCommand = require("model/loginCommand");
        loginCommand = new LoginCommand();
        return loginCommand.execute();
      }
    });
  }

  configMenu.prototype.getTable = function() {
    return this.tableView;
  };

  configMenu.prototype.changeHatenaRowElement = function(switchFlg) {
    this.hatenaSwitch.value = switchFlg;
  };

  return configMenu;

})();

module.exports = configMenu;
