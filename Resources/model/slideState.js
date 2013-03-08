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

  slideState.prototype.moveBackward = function() {
    var page;
    Ti.API.info("[ACTION] スライドから標準状態に戻る。水平方向");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    page = Ti.App.Properties.getString("currentPage");
    Ti.API.info("[ACTION] 現在のページ " + page);
    mainTable.touchEnabled = true;
    mainTable.setOpacity(1.0);
    mainTable.animate({
      duration: 200,
      left: 0
    }, function() {});
    return new defaultState();
  };

  slideState.prototype.moveForward = function() {
    Ti.API.info("[STATE] この状態では何もしない");
    return new slideState();
  };

  return slideState;

})();

module.exports = slideState;
