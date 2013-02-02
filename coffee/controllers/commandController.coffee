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
    Ti.API.info "commandController.useMenu start. commandLabel is #{commandLabel}"
    pageController.showCurrentStatus()
    pageController.use commandLabel
    pageController.showCurrentStatus()
    
    @menu.run commandLabel
    
  applyFeedByTagCommand:(tagName) ->
    # 自分がフォローしてるタグの情報をQiitaAPI利用して
    # 取得してるが非同期で処理してるため必ずしも
    # constructor内でタグに該当するコマンドを割り当てると
    # followingTagsがnullになってる場合があるため
    # followingTagsの値をチェックした上で以下を実施する
    feedByTagCommand = require("model/getFeedByTagCommand")    
    @menu.addCommands("followingTag#{tagName}", new feedByTagCommand(tagName))
    
    return true
    
  countUp:(progressBar) ->
    max = progressBar.max-1
    currentValue = progressBar.value+2
    Ti.API.info "value check. max is #{max} and currentValue is #{currentValue}"
    if currentValue isnt max
      progressBar.value = progressBar.value+1
    else
      Ti.API.info "countUp done!!!"
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      controller.slideMainTable(direction)
      Ti.API.info "pageController.showCurrentStatus()"
      pageController.showLists()
      pageController.useStoredStock()
      pageController.showCurrentStatus()
    

      
    return true
  
          
module.exports = commandController