var followingTagsCommand;
followingTagsCommand = (function() {
  function followingTagsCommand() {}
  followingTagsCommand.prototype.execute = function() {
    return qiita.getFollowingTags(function(result) {
      commandController.countUp(progressBar);
      return true;
    });
  };
  return followingTagsCommand;
})();
module.exports = followingTagsCommand;