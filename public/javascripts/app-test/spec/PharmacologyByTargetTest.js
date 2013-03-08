
describe('Pharm compounds on a target can be searched', function () {
  var store_records, store_operation, store_success;

  beforeEach(function () {
    this.application = Ext.create('Ext.app.Application', {
      name: 'TDGUI',
      appFolder: 'javascripts/app',
      requires: ['TDGUI.util.LDAConstants',
        'TDGUI.store.lda.TargetPharmacologyCountStore',
        'TDGUI.util.TargetPharmacologyCountReader'
      ],

      // Define all the controllers that should initialize at boot up of your application
      controllers: [
//        'LDAParserController',
//        'Users',
        'grids.DynamicGrid'
        //     'grids.PharmaGridInf',
/*        'Grid',
        'NavigationTree',
        'Queryform',
        'SimSearchForm',
        'CmpdByNameForm',
        'TargetByNameForm',
        'PharmByTargetNameForm',
        'PharmByCmpdNameForm',
        'PharmByEnzymeFamily',
//        'SummeryForm',
        'Settings',
//        'pmidTextMiningHitsForm',
//        'pathwayByCompoundForm',
//        'pathwayByProteinForm',
//        'PharmByTargetNameFormInf',
        'CW.controller.ConceptWikiLookup'
*/
      ],

      // autoCreateViewport:true,

      launch: function () {
        console.log("launching app...");
        console.log("ejemmmmmmm: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
        //include the tests in the test.html head
        //jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        //jasmine.getEnv().execute();
      }
    });

  }); // EO beforeEach


  it('should get the number of compounds for a target', function () {
    var store = Ext.create('TDGUI.store.lda.TargetPharmacologyCountStore');
    var conceptUri = 'http://www.conceptwiki.org/concept/b932a1ed-b6c3-4291-a98a-e195668eda49';
    var loadSuccess, loadOp, loadRecs;
    store.proxy.extraParams = {
      uri: conceptUri,
      _format: 'json'
    };

    store.load(function(recs, op, success) {
      loadSuccess = success;
      loadOp = op;
      loadRecs = recs;
    });

    waitsFor(function () {
      return !store.isLoading();
    }, 'TargetPharmaCountStore not loaded :(', 4000);

    runs(function () {
      expect(loadSuccess).toBeTruthy();
      expect(loadRecs.length).toEqual(1);
    })

  });

/*
  it('and results can be paginated', function () {
    var store = Ext.create('LDA.store.TargetPharmacologyPaginatedStore', {});
    console.log("test ONE");
    store.uri = 'http://www.conceptwiki.org/concept/b932a1ed-b6c3-4291-a98a-e195668eda49';
    console.log("test ONE: before store load...");
    store.load(function (records, operation, success) {
      console.log ("merdiña xa");
      store_records = records;
      store_operation = operation;
      store_success = operation.success;
    });
    console.log("test ONE: before waitsFor...");
    waitsFor(
      function () {
        return !store.isLoading();
      },
      "load never completed",
      4000
    );
    console.log("test ONE: after waitsFor...");
    runs(function () {
      expect(store_success).toEqual(true);
    });
  }); // EO it


  it('and results can be filtered for activities', function () {
    console.log("test TWO");
    var store = Ext.create('LDA.store.TargetPharmacologyPaginatedStore', {});
    store.uri = 'http://www.conceptwiki.org/concept/b932a1ed-b6c3-4291-a98a-e195668eda49';
    store.setActivityType('IC50');
    store.setActivityValue('10000');
    store.setActivityCondition('<');
    store.load(function (records, operation, success) {
      store_records = records;
      store_operation = operation;
      store_success = operation.success;
    });
    waitsFor(
      function () {
        console.log("fucking waitsFor...");
        return !store.isLoading();
      },
      "load never completed",
      4000
    );
    runs(function () {
      console.log("testing true is true...");
      expect(true).toEqual(true);
//      expect(store_success).toEqual(true);
    });
  }); // EO it...


  it('and specific pages can be requested', function () {
    console.log("test THREE");
    var store = Ext.create('LDA.store.TargetPharmacologyPaginatedStore', {});
    store.uri = 'http://www.conceptwiki.org/concept/b932a1ed-b6c3-4291-a98a-e195668eda49';
    store.page = 10;
    store.setActivityType('IC50');
    store.setActivityValue('10000');
    store.setActivityCondition('<');
    store.load(function (records, operation, success) {
      store_records = records;
      store_operation = operation;
      store_success = operation.success;
    });
    waitsFor(
      function () {
        return !store.isLoading();
      },
      "load never completed",
      4000
    );
    runs(function () {
      expect(store_success).toEqual(true);
    });
  }); // EO it...
*/
});
