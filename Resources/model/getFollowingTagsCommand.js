var followingTagsCommand;
followingTagsCommand = (function() {
  function followingTagsCommand() {}
  followingTagsCommand.prototype.execute = function() {
    var followinTags;
    followinTags = [];
    return qiita.getFollowingTags(function(result) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        followinTags.push(json.url_name);
        Ti.API.info("commandController.applyFeedByTagCommand run!! tagName is " + json.url_name);
        commandController.applyFeedByTagCommand(json.url_name);
      }
      commandController.countUp(progressBar);
      return true;
    });
  };
  return followingTagsCommand;
})();
module.exports = followingTagsCommand;