class followingTagsCommand
  constructor:() ->
    
  execute:() ->
    followinTags = []  
    qiita.getFollowingTags( (result) ->
      for json in result
        followinTags.push(json.url_name)
        Ti.API.info "commandController.applyFeedByTagCommand run!! tagName is #{json.url_name}"
        commandController.applyFeedByTagCommand json.url_name
        
      # Ti.App.Properties.setList "followinTags",followinTags
      
      commandController.countUp(progressBar)
      return true
    )
    

module.exports = followingTagsCommand  