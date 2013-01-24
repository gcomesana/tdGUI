
Ext.require('Ext.app.Application');

describe('External request for target', function () {
  var store_records, store_operation, store_success, ctrl = null;
  var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';

  var accParam = 'P12345';
  var uuidParam = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';
  var paramList = 'P08913;59aabd64-bee9-45b7-bbe0-9533f6a1f6bc,Q14596;ec79efff-65cb-45b1-a9f5-dddfc1c4025c,Q5H943;eeaec894-d856-4106-9fa1-662b1dc6c6f1,P29274;979f02c6-3986-44d6-b5e8-308e89210c8d,P42345;fc2cb21b-3dcd-42ab-8bfc-d6bfe8d7d35a';

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
      requires: ['TDGUI.util.LDAConstants', 'TDGUI.store.lda.TargetStore',
              'TDGUI.util.TargetReader', 'TDGUI.util.Utils'],

      controllers: ['TDGUI.controller.Viewport'],

      launch: function () {
        console.log("ExternalRequestTest: launchinnnnnnnnng: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
      }
    }); // EO Ext.create...

    ctrl = Ext.create('TDGUI.util.Utils');

//    console.log("EO beforeEach: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
  }); // EO beforeEach



  describe ('Doing preliminary tests', function () {
    it ('makes a tautology test: true is true', function () {
      expect(true).toEqual(true);

    }); // EO it
  });


  describe ('Method updataTargetList', function () {
    it ('should return a url for a uniprot accession param', function () {
      var resp_json = null;

      var res = ctrl.updateTargetList(accParam);
      expect(res).not.toBeNull();
      expect(res.url).toBeDefined();
      expect(res.url.search(/get_protein_by_acc/) == -1).toBeFalsy();
      expect(res.params.acc).toBeDefined();
      expect(res.params.acc.search(/[A-Z][A-Z0-9]{5}/) == -1).toBeFalsy();

    });


    it ('should return a url for a uniprot accession param', function () {
      var resp_json = null;

      var res = ctrl.updateTargetList(uuidParam);
      expect(res).not.toBeNull();
      expect(res.url).toBeDefined();
      expect(res.url.search(/get_protein_by_name/) == -1).toBeFalsy();
      expect(res.params.thelabel).toBeDefined();
      expect(res.params.thelabel).toEqual('');
      expect(res.params.uuid).toBeDefined()

      expect(res.params.uuid.search(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/) == -1).toBeFalsy();

    })
  });

})