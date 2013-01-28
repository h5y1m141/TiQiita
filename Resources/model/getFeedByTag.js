var getFeedByTagCommand;
getFeedByTagCommand = (function() {
  function getFeedByTagCommand() {}
  getFeedByTagCommand.prototype.execute = function() {
    var followinTags, tag, _i, _len;
    followinTags = Ti.App.Properties.getList("followinTags");
    for (_i = 0, _len = followinTags.length; _i < _len; _i++) {
      tag = followinTags[_i];
      qiita.getFeedByTag(tag(function(result, links) {
        var lastURL, link, nextURL, _j, _len2, _obj;
        for (_j = 0, _len2 = links.length; _j < _len2; _j++) {
          link = links[_j];
          if (link["rel"] === 'next') {
            nextURL = link["url"];
          } else if (link["rel"] === 'last') {
            lastURL = link["url"];
          }
        }
        _obj = {
          label: this.value,
          nextURL: nextURL,
          lastURL: lastURL
        };
        return pageController.set(_obj);
      }));
    }
    return true;
  };
  return getFeedByTagCommand;
})();
module.exports = getFeedByTagCommand;