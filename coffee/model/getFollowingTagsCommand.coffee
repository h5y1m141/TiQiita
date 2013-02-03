class followingTagsCommand
  constructor:() ->
    
  execute:() ->

    qiita.getFollowingTags( (result) ->
      for json in result

        commandController.applyFeedByTagCommand json.url_name
        
      
      # commandController.countUp(progressBar)
      return true
    )
    

module.exports = followingTagsCommand  