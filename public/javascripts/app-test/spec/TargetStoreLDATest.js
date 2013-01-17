
describe('Searching for target information', function () {
  var store_records, store_operation, store_success;
  var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';

  beforeEach (function () {
//    console.log("INIT beforeEach: "+LDA.helper.LDAConstants.LDA_ASSAY_OF_ACTIVITY);
    this.addMatchers({
      toBeSameClass: function (expected) {
        return typeof this.actual == typeof expected;
      }
    })

    this.application = Ext.create('Ext.app.Application', {
      name: 'TDGUI',
      appFolder: 'javascripts/app',
      requires: ['LDA.helper.LDAConstants', 'LDA.store.TargetStore',
        'TDGUI.util.LDAConstants', 'TDGUI.store.lda.TargetStore', 'TDGUI.util.TargetReader',
        'TDGUI.store.lda.TargetPharmacologyStore', 'TDGUI.util.TargetPharmacologyReader'],

      launch: function () {
        console.log("launchinnnnnnnnng: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
      }
    }); // EO Ext.create...

//    console.log("EO beforeEach: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
  }); // EO beforeEach



  describe ('Doing preliminary tests', function () {
    it ('makes a tautology test: true is true', function () {
      expect(true).toEqual(true);
    }); // EO it



    it ('getting just a test json response from controller', function () {
      var resp_json = null;

      Ext.Ajax.request({
        url: '/core_api_calls/test',
        params: {
          ping: 'cagallon'
        },
        method: 'GET',

        success: function (response, opts) {
          resp_json = eval('('+response.responseText+')');
        }
      });

      waitsFor (function () {
        return resp_json != null;
      }, 'No got result after 500ms', 500);

      runs (function () {
        expect(resp_json.pong).not.toBe(null);
      });

    });
  });


  it ('getting just the json response', function () {
    var api_json;
    Ext.Ajax.request({
      url: '/core_api_calls/protein_info',
      params: {
        protein_uri: conceptwiki_uri_mock
      },
      method: 'GET',

      success: function (resp, opts) {
        api_json = eval ('('+resp.responseText+')');
      }

    });

    waitsFor (function () {
      return api_json !== null && api_json !== undefined
    }, 'No information for target got', 5000);

    runs (function () {
      expect(api_json.format).toEqual('linked-data-api');
      expect(api_json.result.primaryTopic).not.toBeNull();
      expect(api_json.result.primaryTopic.exactMatch).toBeDefined();

      var exactMatchType = Object.prototype.toString.call(api_json.result.primaryTopic.exactMatch);
      expect(exactMatchType).toMatch(/Array/);
      var results = api_json.result.primaryTopic.exactMatch.length;
      expect(results).toEqual(2);
    })

  });


  it ('using LDA API (jsonp) to get target information', function () {
    console.log('targetStore base_url: '+ldaBaseUrl);
    var targetInfoStore = Ext.create('LDA.store.TargetStore', {
      storeId: 'TargetStoreBis'
    });
    targetInfoStore.proxy.extraParams.uri = conceptwiki_uri_mock;

    var storeLoaded = false;
    var recsLoaded, opLoaded, successLoaded;
    targetInfoStore.load (function (recs, op, success) {
      storeLoaded = true;
      recsLoaded = recs;
      successLoaded = success;
    });

    waitsFor(function () {
      return !targetInfoStore.isLoading();
    }, 'Store never loaded', 5000);

    runs(function () {
      expect(storeLoaded).toBeTruthy();
      expect(recsLoaded).toBeDefined();
      expect(recsLoaded.length).toBeGreaterThan(0);
    });

  });



  it ('using TDGUI LDA adaptation (json) to get target information', function() {
    var targetInfoStore = Ext.create('TDGUI.store.lda.TargetStore');

    targetInfoStore.proxy.extraParams.protein_uri = conceptwiki_uri_mock;

    var storeLoaded = false;
    var recsLoaded, opLoaded, successLoaded, recsData;
    targetInfoStore.load (function (recs, op, success) {
      storeLoaded = true;
      recsLoaded = recs.length;
      recsData = recs;
      successLoaded = success;
    });

    waitsFor(function () {
      return !targetInfoStore.isLoading();
    }, 'Store never loaded', 5000);

    runs(function () {
      expect(storeLoaded).toBeTruthy();
      expect(recsLoaded).toBeDefined();
      expect(recsLoaded).toBeGreaterThan(0);
    });
  })

}); // EO describe
