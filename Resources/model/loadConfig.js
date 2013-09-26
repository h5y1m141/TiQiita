var loadConfig;

loadConfig = (function() {

  function loadConfig() {
    var config, file;
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
    file = config.read().toString();
    this.json = JSON.parse(file);
  }

  loadConfig.prototype.getNendData = function() {
    return this.json.nend;
  };

  loadConfig.prototype.getAdMobData = function() {
    return this.json.admob;
  };

  loadConfig.prototype.getGoogleAnalyticsKey = function() {
    return this.json.GoogleAnalytics.key;
  };

  loadConfig.prototype.getbitlyAPIKey = function() {
    return this.json.bitly.apiKey;
  };

  return loadConfig;

})();

module.exports = loadConfig;
