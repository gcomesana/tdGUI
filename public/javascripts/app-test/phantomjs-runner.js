var page = require("webpage").create();
var fs = require('fs');

// supress all the stdout messages from the runner so our reporter looks
// pretty even when tests fail.
page.onConsoleMessage = function (msg, source, linenumber) {
};
page.onError = function (msg, trace) {
};

// ascii control character to clear the screen so you can write fresh.
var cls = function () {
  return '\u001b[2J\u001b[1;3H';
};

// keep some state around how the test suite is doing for future reporting.
var ran = 0,
  totalSpecs = 100,
  totalFailures = 0,
  failureMessages = [],
  cols = 80;

// Here's the new `experimental` API.
page.onCallback = function (callbackData) {
  var pld = callbackData["payload"];
  switch (callbackData["type"]) {
    case "init":
      // capture the total number of tests that are going to run in the
      // suite.
      totalSpecs = pld;
      break;

    case "spec":
      // increment the number of tests that have been run
      ran++;

      // keep track of how many assertions have failed for the completed
      // spec.
      totalFailures += pld.numFailures;

      // aggregate the failure messages so they can be shown at the end.
      if (pld.didFail) {
        failureMessages.push(pld.failureMessage);
      }

      // draw the cat that poops rainbows ...
      var output = cls();
      output += "Running Unit Tests\n";
      output += "Running: " + ran + " of " + totalSpecs + ". Failures: " + totalFailures;
      console.log(output);
      break;

    case "results":
      setTimeout(function () {
        // print all of the test failures after the suite has finished
        // running
        if (totalFailures > 0) {
          console.log("\033[1;31mFailures: " + stopColor);
          for (var i = 0; i < failureMessages.length; ++i) {
            console.log(failureMessages[i]);
          }
          // ugly setTimeouts are just to make sure STDOUT is flushed
          // before the phantom process exits.
          setTimeout(function () {
            phantom.exit(totalFailures > 0 ? 1 : 0);
          }, 250);
        }
      }, 250);
      break;
  }
};

console.log('Open phantom to the provided test runner.');
var htmlrunner = phantom.args[0],
    pwd = fs.workingDirectory;

htmlrunner = "file://" + fs.absolute('test-runner.html');
console.log('htmlrunner: '+htmlrunner);

phantom.injectJs('Jasmine-Parser.js');
UnitTester.init(htmlrunner);
/* page.open("file://localhost/" + pwd + "/" + htmlrunner, function (status) {
page.open(htmlrunner, function(status) {
  if (status != "success") {
    console.log("phantomjs> Could not load '" + htmlrunner + "'.");
    phantom.exit(1);
  }
});
*/