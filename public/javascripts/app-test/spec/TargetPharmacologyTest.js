describe('Searching for pharmacology target information', function () {
  var store_records, store_operation, store_success;
  var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/979f02c6-3986-44d6-b5e8-308e89210c8d';

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
      requires: ['TDGUI.util.LDAConstants', 'TDGUI.store.lda.TargetPharmacologyStore',
        'TDGUI.util.TargetPharmacologyReader'],

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


    it ('getting just the json response', function () {
      var api_json;
      Ext.Ajax.request({
        url: '/core_api_calls/pharm_by_protein_name',
        params: {
          protein_uri: conceptwiki_uri_mock,
          page: 1,
          start: 0,
          limit: 25
        },
        method: 'GET',

        success: function (resp, opts) {
          api_json = eval ('('+resp.responseText+')');
        }

      });

      waitsFor (function () {
        return api_json !== null && api_json !== undefined
      }, '"Information for target never got"', 5000);

      runs (function () {
        expect(api_json.format).toEqual('linked-data-api');
        expect(api_json.result.items).not.toBeNull();
        expect(api_json.result.items.length).toBeGreaterThan(0)

        var exactMatchType = Object.prototype.toString.call(api_json.result.items);
        expect(exactMatchType).toMatch(/Array/);

      });

    }); // EO getting just json response


    it ('using TDGUI LDA adaptation (json) to get target information', function() {

      var targetInfoStore = Ext.create('TDGUI.store.lda.TargetPharmacologyStore');

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

        var recsDataType = Object.prototype.toString.call(recsData);
        expect(recsDataType).toMatch(/Array/);
        expect(recsData[0].fields.getCount()).toBeGreaterThan(10);
      });
    });



  });

}) // EO test suite pharmacology target

