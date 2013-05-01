class commandController
  constructor:() ->
    Menu = require("controllers/menu")
    @menu = new Menu()
    stocksCommand = require("model/getStocksCommand")
    @menu.addCommands("storedStocks",new stocksCommand())
        
    myStocksCommand = require("model/getMyStocksCommand")
    @menu.addCommands("storedMyStocks",new myStocksCommand())

    followerItemsCommand = require("model/getFollowerItemsCommand")
    @menu.addCommands("followerItems",new followerItemsCommand())

  createMenu:() ->
    Ti.API.info "[commandController] createMenu start"


    # configCommand = require("model/configCommand")
    # loginCommand = require("model/loginCommand")
    # @menu.addCommands("config",new configCommand())
    # @menu.addCommands("qiitaLogin", new loginCommand())
    
    
    mainContoroller.refreshMenuTable()
    # @useMenu "storedStocks"      
      

      


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

    

          
module.exports = commandController