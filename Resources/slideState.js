var slideState;

slideState = (function() {

  function slideState() {}

  slideState.prototype.moveBackward = function() {
    Ti.API.info("スライドから標準状態に戻る");
    mainTable.animate({
      duration: 200,
      left: 0
    }, function() {
      return Ti.App.Properties.setBool("stateMainTableSlide", false);
    });
    return new defaultState();
  };

  slideState.prototype.moveForward = function() {
    Ti.API.info("この状態では何もしない");
    return new slideState();
  };

  return slideState;

})();

module.exports = slideState;
