(() ->
  
if testsEnabled
  
  # use Ti.include for jasmine to be a global variable 
  # and being able to drop in jasmine library as is, without modifications
  
  Ti.include('/test/lib/jasmine-1.0.2.js')
  require('test/lib/jasmine-titanium-console')
  
  # include custom tests
  require('test/example')
  
  jasmine.getEnv().addReporter(new jasmine.TitaniumReporter())
  jasmine.getEnv().execute()

)