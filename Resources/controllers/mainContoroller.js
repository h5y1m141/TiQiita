var mainContoroller;
mainContoroller = (function() {
  function mainContoroller() {
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }
  mainContoroller.prototype.init = function() {
    var direction;
    if (controller.networkStatus() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
    } else {
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', false);
      controller.slideMainTable(direction);
      commandController.useMenu("storedStocks");
      commandController.useMenu("followingTags");
    }
    return true;
  };
  mainContoroller.prototype.networkConnectionCheck = function(callback) {
    var currentPage, direction;
    if (controller.networkStatus() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', true);
      currentPage = Ti.App.Properties.getString("currentPage");
      Ti.API.info("mainContoroller.networkConnectionCheck " + currentPage);
      return controller.slideMainTable(direction);
    } else {
      return callback();
    }
  };
  mainContoroller.prototype.authenticationCheck = function(callback) {
    var token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      return this._alertViewShow(this.authenticationFailMessage);
    } else {
      return callback();
    }
  };
  mainContoroller.prototype._alertViewShow = function(messsage) {
    alertView.editMessage(messsage);
    return alertView.animate();
  };
  return mainContoroller;
})();
module.exports = mainContoroller;