class loadConfig
  constructor:() ->
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    @json = JSON.parse(file)
    
  getNendData:() ->
    return @json.nend
    
  getAdMobData:() ->
    return @json.admob

  getGoogleAnalyticsKey:() ->
    return @json.GoogleAnalytics.key
    
  getbitlyAPIKey:() ->            
    return @json.bitly.apiKey
    
module.exports = loadConfig 
