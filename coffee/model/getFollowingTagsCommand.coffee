class followingTagsCommand
  constructor:() ->
  execute:() ->
    qiita.getFollowingTags( (result) ->
      commandController.countUp(progressBar)
      return true
    )
    

module.exports = followingTagsCommand  