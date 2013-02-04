var followingTagsCommand;
followingTagsCommand = (function() {
  function followingTagsCommand() {}
  followingTagsCommand.prototype.execute = function() {
    return qiita.getFollowingTags(function(result) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        commandController.applyFeedByTagCommand(json.url_name);
      }
      commandController.countUp(progressBar);
      return true;
    });
  };
  return followingTagsCommand;
})();
module.exports = followingTagsCommand;