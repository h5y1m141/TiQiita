var loginCommand;
loginCommand = (function() {
  function loginCommand() {}
  loginCommand.prototype.execute = function() {
    var direction, param;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    direction = "vertical";
    Ti.App.Properties.setBool('stateMainTableSlide', false);
    controller.slideMainTable(direction);
    qiita._auth(param, function(token) {
      if (token === null) {
        alertView.editMessage("ユーザIDかパスワードが間違ってます");
        return alertView.animate();
      } else {
        alertView.editMessage("認証出来ました");
        alertView.animate();
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        return Ti.App.Properties.setString('QiitaLoginPassword', param.password);
      }
    });
    return true;
  };
  return loginCommand;
})();
module.exports = loginCommand;