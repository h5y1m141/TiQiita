var followingTagsCommand;
followingTagsCommand = (function() {
  function followingTagsCommand() {}
  followingTagsCommand.prototype.execute = function() {
    return qiita.getFollowingTags(function(result) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        Ti.API.info("followingTag" + json.url_name + "nextURL is initiazlie!!");
        Ti.App.Properties.setString("followingTag" + json.url_name + "nextURL", null);
        commandController.applyFeedByTagCommand(json.url_name);
      }
      commandController.countUp(progressBar);
      return true;
    });
  };
  return followingTagsCommand;
})();
module.exports = followingTagsCommand;