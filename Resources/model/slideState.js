var slideState;

slideState = (function() {

  function slideState() {}

  slideState.prototype.sayState = function() {
    return "[STATE スライド状態]";
  };

  slideState.prototype.moveUP = function() {
    Ti.API.info("[ACTION] スライドから標準状態に戻る。垂直方向");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    mainTable.touchEnabled = true;
    mainTable.animate({
      duration: 200,
      top: 0
    }, function() {
      return statusView.animate({
        duration: 400,
        top: -50
      });
    });
    return new defaultState();
  };

  slideState.prototype.moveDown = function() {
    Ti.API.info("[STATE スライド状態] この状態では何もしない");
    return new slideState();
  };

  return slideState;

})();

module.exports = slideState;
