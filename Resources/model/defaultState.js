var defaultState;
defaultState = (function() {
  function defaultState() {}
  defaultState.prototype.sayState = function() {
    return "STATE: 標準状態";
  };
  defaultState.prototype.moveUP = function() {
    return Ti.API.info("この状態では何もしない");
  };
  defaultState.prototype.moveDown = function() {
    Ti.API.info("ACTION: スライド開始");
    Ti.App.Properties.setBool("stateMainTableSlide", true);
    statusView.animate({
      duration: 400,
      top: 0
    }, function() {
      mainTable.touchEnabled = false;
      return mainTable.animate({
        duration: 200,
        top: 50
      });
    });
    return new slideState();
  };
  defaultState.prototype.moveBackward = function() {};
  defaultState.prototype.moveForward = function() {
    Ti.API.info("ACTION: スライド開始");
    Ti.App.Properties.setBool("stateMainTableSlide", true);
    mainTable.touchEnabled = false;
    mainTable.animate({
      duration: 200,
      left: 160
    }, function() {
      return mainTable.setOpacity(0.5);
    });
    return new slideState();
  };
  return defaultState;
})();
module.exports = defaultState;