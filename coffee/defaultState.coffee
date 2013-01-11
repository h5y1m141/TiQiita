class defaultState
  constructor: () ->
    # Ti.API.info "STATE: 標準状態"
    
    
  sayState: () ->
    return "STATE: 標準状態"

  moveBackward: () ->

    # return new defaultState()
  moveForward: () ->
    Ti.API.info "ACTION: スライド開始"
    Ti.App.Properties.setBool("stateMainTableSlide",true)
    mainTable.touchEnabled = false
    mainTable.animate({
      duration:200
      left:160
    }, ()->
      mainTable.setOpacity(0.5)
    )
    
    return new slideState()



module.exports = defaultState 