var followingTagsCommand;

followingTagsCommand = (function() {

  function followingTagsCommand() {
    Ti.API.info("followingTagsCommand start");
    qiita.getFollowingTags(function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        Ti.API.info("followingTag" + json.url_name + "nextURL is initiazlie!!");
        Ti.App.Properties.setString("followingTag" + json.url_name + "nextURL", null);
        commandController.applyFeedByTagCommand(json.url_name);
      }
      return true;
    });
  }

  followingTagsCommand.prototype.execute = function() {
    return Ti.API.info("run");
  };

  return followingTagsCommand;

})();

module.exports = followingTagsCommand;
