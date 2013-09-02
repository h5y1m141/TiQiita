var baseCommand;

baseCommand = (function() {

  function baseCommand() {
    this.direction = "vertical";
  }

  baseCommand.prototype._currentSlideState = function() {
    var flg, state;
    flg = Ti.App.Properties.getBool("stateMainTableSlide");
    if (flg === true) {
      state = "slideState";
    } else {
      state = "default";
    }
    return state;
  };

  baseCommand.prototype._showStatusView = function() {
    Ti.API.info("[ACTION] スライド開始");
    progressBar.value = 0;
    progressBar.show();
    return statusView.animate({
      duration: 400,
      top: 0
    }, function() {
      Ti.API.debug("mainTable を上にずらす");
      return mainTable.animate({
        duration: 200,
        top: 50
      });
    });
  };

  baseCommand.prototype._hideStatusView = function() {
    Ti.API.info("[ACTION] スライドから標準状態に戻る。垂直方向");
    return mainTable.animate({
      duration: 200,
      top: 0
    }, function() {
      Ti.API.debug("mainTable back");
      progressBar.hide();
      return statusView.animate({
        duration: 400,
        top: -50
      });
    });
  };

  return baseCommand;

})();

module.exports = baseCommand;
