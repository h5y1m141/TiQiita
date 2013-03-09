class commandController
  constructor:() ->
    Menu = require("controllers/menu")
    @menu = new Menu()

  createMenu:(user) ->
    stocksCommand = require("model/getStocksCommand")
    configCommand = require("model/configCommand")
    loginCommand = require("model/loginCommand")

    @menu.addCommands("storedStocks",new stocksCommand())
    @menu.addCommands("config",new configCommand())
    @menu.addCommands("qiitaLogin", new loginCommand())

    if user is "QiitaUser"
      Ti.API.info "[MENU] for QiitaUser"
      myStocksCommand = require("model/getMyStocksCommand")
      @menu.addCommands("storedMyStocks",new myStocksCommand())
      
      mainContoroller.refreshMenuTable()
      
      

      
      # followingTagsCommand = require("model/getFollowingTagsCommand")
      # @menu.addCommands("followingTags", new followingTagsCommand())
      


    return true

    
  useMenu:(commandLabel) ->
    Ti.API.info "commandController.useMenu start. commandLabel is #{commandLabel}"
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

    
  countUp:() ->
    Ti.API.info "[COMMAND] countUp start"
    direction = "vertical"
    Ti.App.Properties.setBool 'stateMainTableSlide',true
    return mainContoroller.slideMainTable(direction)

          
module.exports = commandController