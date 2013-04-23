(() ->
  
if testsEnabled
  
  # use Ti.include for jasmine to be a global variable 
  # and being able to drop in jasmine library as is, without modifications
  
  # Ti.include('/test/lib/jasmine-1.0.2.js')
  Ti.include('/test/lib/jasmine-1.3.1.js')
  Ti.include('/test/lib/jasmine.async.min.js')
  require('test/lib/jasmine-titanium-console')
  
  # include custom tests
  # require('test/example')
  # require('test/qiita')
  # require('test/qiitaController')
  # require('test/tableView')
  require('test/qiitaUser')
  jasmine.getEnv().addReporter(new jasmine.TitaniumReporter())
  jasmine.getEnv().execute()

)