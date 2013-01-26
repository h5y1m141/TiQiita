var slideState;
slideState = (function() {
  function slideState() {}
  slideState.prototype.sayState = function() {
    return "STATE: スライド状態";
  };
  slideState.prototype.moveUP = function() {
    Ti.API.info("ACTION: スライドから標準状態に戻る。垂直方向");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
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
    return Ti.API.info("この状態では何もしない");
  };
  slideState.prototype.moveBackward = function() {
    Ti.API.info("ACTION: スライドから標準状態に戻る。水平方向");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    mainTable.touchEnabled = true;
    mainTable.setOpacity(1.0);
    mainTable.animate({
      duration: 200,
      left: 0
    }, function() {});
    return new defaultState();
  };
  slideState.prototype.moveForward = function() {
    return Ti.API.info("この状態では何もしない");
  };
  return slideState;
})();
module.exports = slideState;