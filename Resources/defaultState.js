var defaultState;

defaultState = (function() {

  function defaultState() {
    Ti.API.info("STATE: 標準状態");
  }

  defaultState.prototype.sayState = function() {
    return "STATE: 標準状態";
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
