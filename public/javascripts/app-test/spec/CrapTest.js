describe('Targets can be searched', function () {
  var store_records, store_operation, store_success;
  beforeEach (function () {
    console.log("*** Starting CrapTest.js ***");
    this.application = Ext.create('Ext.app.Application', {
      name: 'TDGUI',
      appFolder: '../app',
      requires: ['LDA.helper.LDAConstants'],

      launch: function () {
        console.log("launchinnnnnnnnng: "+LDA.helper.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
      }
    }); // EO Ext.create...

  }); // EO beforeEach


  it ('makes a tautology test: true is true', function () {
    expect(true).toEqual(true);
  }); // EO it

  it ('test the rails controller', function () {

  });

  it ('uses LDA API to get target information', function () {
  });

}); // EO describe
