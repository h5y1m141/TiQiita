class slideState
  constructor: () ->

  moveBackward: () ->
    Ti.API.info "スライドから標準状態に戻る"
    mainTable.animate({
      duration:200,
      left:0
    },()-> Ti.App.Properties.setBool("stateMainTableSlide",false))
    return new defaultState()
    
  moveForward: () ->
    Ti.API.info "この状態では何もしない"
    return new slideState()

module.exports = slideState