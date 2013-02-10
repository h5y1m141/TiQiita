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
      if (token === null) {
        return alert("ユーザIDかパスワードが間違ってます");
      } else {
        alert("認証出来ました");
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        Ti.App.Properties.setString('QiitaLoginPassword', param.password);
        return menuTable.refreshMenu();
      }
    });
    return true;
  };
  return loginCommand;
})();
module.exports = loginCommand;