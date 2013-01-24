// A simple jasmine reporter that will report over the `callPhantom` API in
// the new PhantomJS 1.7 release.
NewConsoleReporter = function() { };
NewConsoleReporter.prototype = {
  reportRunnerStarting: function(runner) {
    // Announce that the suite is starting by letting the runner know how
    // many specs are going to be run.
    this.tellPhantom({"type":"init", "payload": runner.specs().length});
  },
  reportSpecResults: function(spec) {
    // ... collect the spec results

    // pass along the small payload of information to phantom so the test
    // reporter can correctly display whatever it needs to.
    this.tellPhantom({
      "type":"spec",
      "payload":{
        "didFail": spec.didFail,
        "suite": spec.suite.description,
        "description": spec.description,
        "numFailures": failures,
        "failureMessage": consoleFailure
      }});
  },
  reportRunnerResults: function(runner) {
    // Announce that the test suite is finished and that phantom should exit.
    this.out({"type":"results", "payload": {}});
  },
  tellPhantom: function(message) {
    if (window.callPhantom) {
      window.callPhantom(message);
    }
  }
};
jasmine.NewConsoleReporter = NewConsoleReporter;