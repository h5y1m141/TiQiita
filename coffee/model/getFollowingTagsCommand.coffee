class followingTagsCommand
  constructor:() ->
    Ti.API.info "followingTagsCommand start"
    qiita.getFollowingTags( (result,links) ->
      for json in result
        # 起動時にそれぞれのタグに該当する次ページURLパラメータ
        # 初期化
        Ti.API.info "followingTag#{json.url_name}nextURL is initiazlie!!" 
        Ti.App.Properties.setString "followingTag#{json.url_name}nextURL", null
        commandController.applyFeedByTagCommand json.url_name
      return true
    )    
    
  execute:() ->
    Ti.API.info "followingTagsCommand start"
    qiita.getFollowingTags( (result,links) ->
      for json in result
        # 起動時にそれぞれのタグに該当する次ページURLパラメータ
        # 初期化
        Ti.API.info "followingTag#{json.url_name}nextURL is initiazlie!!" 
        Ti.App.Properties.setString "followingTag#{json.url_name}nextURL", null
        commandController.applyFeedByTagCommand json.url_name
      
      # if result
      #   Ti.App.Properties.setBool "followingTagsError", false
      #   for json in result
      #     # 起動時にそれぞれのタグに該当する次ページURLパラメータ
      #     # 初期化
      #     Ti.API.info "followingTag#{json.url_name}nextURL is initiazlie!!" 
      #     Ti.App.Properties.setString "followingTag#{json.url_name}nextURL", null
      #     commandController.applyFeedByTagCommand json.url_name

      # else
      #   Ti.App.Properties.setBool "followingTagsError", true
                
      

      return true
    )
    

module.exports = followingTagsCommand  