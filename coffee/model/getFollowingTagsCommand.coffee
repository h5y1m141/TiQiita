class followingTagsCommand
  constructor:() ->
    
  execute:() ->
    followinTags = []  
    qiita.getFollowingTags( (result) ->
      for json in result
        followinTags.push(json.url_name)
        commandController.applyFeedByTagCommand json.url_name
        

      
      commandController.countUp(progressBar)
      return true
    )
    

module.exports = followingTagsCommand  