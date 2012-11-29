var slideState;

slideState = (function() {

  function slideState() {
    Ti.API.info("STATE: スライド状態");
  }

  slideState.prototype.sayState = function() {
    return "STATE: スライド状態";
  };

  slideState.prototype.moveBackward = function() {
    Ti.API.info("ACTION: スライドから標準状態に戻る");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    mainTable.touchEnabled = true;
    mainTable.setOpacity(1.0);
    mainTable.animate({
      duration: 200,
      left: 0
    }, function() {
      return Ti.API.info("アニメーション終了");
    });
    return new defaultState();
  };

  slideState.prototype.moveForward = function() {
    return Ti.API.info("この状態では何もしない");
  };

  return slideState;

})();

module.exports = slideState;
