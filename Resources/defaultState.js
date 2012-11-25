var defaultState;

defaultState = (function() {

  function defaultState() {}

  defaultState.prototype.moveBackward = function() {
    Ti.API.info("この状態では何もしない");
    return new defaultState();
  };

  defaultState.prototype.moveForward = function() {
    Ti.API.info("スライド開始");
    mainTable.animate({
      duration: 200,
      left: 80
    }, function() {
      return Ti.App.Properties.setBool("stateMainTableSlide", true);
    });
    return new slideState();
  };

  return defaultState;

})();

module.exports = defaultState;
