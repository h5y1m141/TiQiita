class rightOutsideState
  constructor: () ->
    Ti.API.info "STATE: スライド状態"
    
  sayState: () ->
    return "STATE: 右端まで一旦スライドして戻る"

  moveBackward: () ->
    Ti.API.info "ACTION: スライドから標準状態に戻る"

    mainTable.touchEnabled = true

    config.animate({
      duration:10
      left:320
      curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
    }, ()->
      mainTable.setOpacity(1.0)
      mainTable.animate({
        duration:200
        left:0
        curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
      })
    )
    
    return new defaultState()
    
  moveForward: () ->
    Ti.API.info "この状態では何もしない"
    
    return new slideState()
    
  moveRightOutside: () ->
    Ti.API.info "この状態では何もしない"
    
module.exports = rightOutsideState  