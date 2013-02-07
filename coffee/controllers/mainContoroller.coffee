class mainContoroller
  constructor:() ->

  init:() ->
    if controller.networkStatus() is false
      alertView.editMessage("ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください")
      alertView.animate()
    else  
      # direction = "horizontal"
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',false
      controller.slideMainTable(direction)
      
      commandController.useMenu "storedStocks"
      commandController.useMenu "followingTags"
      
    return true

  networkConnectionCheck:(callback) ->
    if controller.networkStatus() is false
      alertView.editMessage("ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください")
      alertView.animate()
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "mainContoroller.networkConnectionCheck #{currentPage}"
      return controller.slideMainTable(direction)
      
    else  
      return callback()


module.exports = mainContoroller  