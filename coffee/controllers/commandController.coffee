class commandController
  constructor:() ->
    Menu = require("controllers/menu")
    @menu = new Menu()
    myStocksCommand = require("model/getMyStocksCommand")
    stocksCommand = require("model/getStocksCommand")
    configCommand = require("model/configCommand")
    followingTagsCommand = require("model/getFollowingTagsCommand")
    
    @menu.addCommands("storedMyStocks",new myStocksCommand())
    @menu.addCommands("storedStocks",new stocksCommand())
    @menu.addCommands("config",new configCommand())
    @menu.addCommands("followingTags", new followingTagsCommand())


    
  useMenu:(commandLabel) ->

    @menu.run(commandLabel)
    
  applyFeedByTagCommand:(tagName) ->
    # 自分がフォローしてるタグの情報をQiitaAPI利用して
    # 取得してるが非同期で処理してるため必ずしも
    # constructor内でタグに該当するコマンドを割り当てると
    # followinTagsがnullになってる場合があるため
    # followinTagsの値をチェックした上で以下を実施する
    feedByTagCommand = require("model/getFeedByTagCommand")    
    @menu.addCommands("followinTag#{tagName}", new feedByTagCommand(tagName))
    
    return true
    
  countUp:(progressBar) ->
    max = progressBar.max-1
    currentValue = progressBar.value
    Ti.API.info "value check. max is #{max} and currentValue is #{currentValue}"
    if currentValue is max
      Ti.API.info "countUp done!!!"
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      controller.slideMainTable(direction)
      
      pageController.useStoredStock()
      Ti.API.info "pageController.showCurrentStatus()"
      pageController.showLists()
      pageController.showCurrentStatus()

    else  
      progressBar.value = progressBar.value+1
      
    return true
  
          
module.exports = commandController