(function() {});
if (testsEnabled) {
  Ti.include('/test/lib/jasmine-1.3.1.js');
  Ti.include('/test/lib/jasmine.async.min.js');
  require('test/lib/jasmine-titanium-console');
  require('test/qiita');
  jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
  jasmine.getEnv().execute();
}