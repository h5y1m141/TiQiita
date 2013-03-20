var loginCommand;

loginCommand = (function() {

  function loginCommand() {}

  loginCommand.prototype.execute = function() {
    var param,
      _this = this;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    Ti.API.info("[INFO] login start.");
    qiita._auth(param, function(token) {
      if (token === null) {
        alert("ユーザIDかパスワードが間違ってます");
        return actInd.hide();
      } else {
        alert("認証出来ました");
        actInd.hide();
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        Ti.App.Properties.setString('QiitaLoginPassword', param.password);
        Ti.App.Properties.setString('QiitaToken', token);
        return mainContoroller.refreshMenuTable();
      }
    });
    return true;
  };

  return loginCommand;

})();

module.exports = loginCommand;
