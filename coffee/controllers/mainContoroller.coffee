class mainContoroller
  constructor:() ->

  init:() ->
    if controller.networkStatus() is false
      alertView.editMessage("ネットワークが利用できない状態です。ご利用の端末のネットワーク設定を再度ご確認ください")
      alertView.animate()
    else  
      # direction = "horizontal"
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',false
      controller.slideMainTable(direction)
      
      commandController.useMenu "storedStocks"
      commandController.useMenu "followingTags"
      
    return true


module.exports = mainContoroller  