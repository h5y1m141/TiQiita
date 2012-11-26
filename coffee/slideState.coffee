class slideState
  constructor: () ->
    Ti.API.info "STATE: スライド状態"
    
    
  sayState: () ->
    return "STATE: スライド状態"
    
  moveBackward: () ->
    Ti.API.info "ACTION: スライドから標準状態に戻る"
    Ti.App.Properties.setBool("stateMainTableSlide",false)
    mainTable.touchEnabled = true
    

    mainTable.animate({
      duration:200,
      left:0
    },()->
      mainTable.setOpacity(1.0)
    
    )
    return new defaultState()
    
  moveForward: () ->
    Ti.API.info "この状態では何もしない"

module.exports = slideState