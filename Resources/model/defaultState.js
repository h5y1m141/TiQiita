var defaultState;

defaultState = (function() {

  function defaultState() {}

  defaultState.prototype.sayState = function() {
    return "[STATE 標準状態]";
  };

  defaultState.prototype.moveUP = function() {
    Ti.API.info("[STATE 標準状態]この状態では何もしない");
    return new defaultState();
  };

  defaultState.prototype.moveDown = function() {
    Ti.API.info("[ACTION] スライド開始");
    progressBar.value = 0;
    progressBar.show();
    Ti.App.Properties.setBool("stateMainTableSlide", true);
    statusView.animate({
      duration: 400,
      top: 0
    }, function() {
      return mainTable.animate({
        duration: 200,
        top: 50
      });
    });
    return new slideState();
  };

  return defaultState;

})();

module.exports = defaultState;
