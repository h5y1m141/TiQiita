var loginCommand;
loginCommand = (function() {
  function loginCommand() {}
  loginCommand.prototype.execute = function() {
    var param;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    qiita._auth(param, function(token) {
      var logindID;
      if (token === null) {
        alert("ユーザIDかパスワードが間違ってます");
        return actInd.hide();
      } else {
        alert("認証出来ました。\n自動的にメインの画面に切り替わりますのでしばらくお待ち下さい");
        actInd.hide();
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        Ti.App.Properties.setString('QiitaLoginPassword', param.password);
        Ti.App.Properties.setString('QiitaToken', token);
        logindID = Ti.App.Properties.getString('QiitaLoginID');
        qiita.setRequestParameter(logindID);
        return qiita._auth("", function(token) {
          Ti.API.info("token is " + token);
          mainContoroller.createMainWindow();
          mainContoroller.refreshMenuTable();
          mainContoroller.startApp();
          tabGroup.setActiveTab(0);
          return tabGroup.open();
        });
      }
    });
    return true;
  };
  return loginCommand;
})();
module.exports = loginCommand;