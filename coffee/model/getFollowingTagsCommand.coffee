class followingTagsCommand
  constructor:() ->
  execute:() ->
    qiita.getFollowingTags( (result) ->
      return true
    )
    

module.exports = followingTagsCommand  