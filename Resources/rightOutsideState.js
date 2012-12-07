var rightOutsideState;

rightOutsideState = (function() {

  function rightOutsideState() {
    Ti.API.info("STATE: スライド状態");
  }

  rightOutsideState.prototype.sayState = function() {
    return "STATE: 右端まで一旦スライドして戻る";
  };

  rightOutsideState.prototype.moveBackward = function() {
    Ti.API.info("ACTION: スライドから標準状態に戻る");
    mainTable.touchEnabled = true;
    config.animate({
      duration: 10,
      left: 320,
      curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
    }, function() {
      mainTable.setOpacity(1.0);
      return mainTable.animate({
        duration: 200,
        left: 0,
        curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
      });
    });
    return new defaultState();
  };

  rightOutsideState.prototype.moveForward = function() {
    Ti.API.info("この状態では何もしない");
    return new slideState();
  };

  rightOutsideState.prototype.moveRightOutside = function() {
    return Ti.API.info("この状態では何もしない");
  };

  return rightOutsideState;

})();

module.exports = rightOutsideState;
