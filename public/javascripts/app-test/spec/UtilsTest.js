

var myApp = null;
var toType;

describe('Searching for target information', function () {
  var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';
  var utils, arron, ctrl;

  beforeEach (function () {
//    console.log("INIT beforeEach: "+LDA.helper.LDAConstants.LDA_ASSAY_OF_ACTIVITY);
    this.addMatchers({
      toBeSameClass: function (expected) {
        return typeof this.actual == typeof expected;
      }
    })

    toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    };

    myApp = Ext.create('Ext.app.Application', {
      name: 'TDGUI',
      appFolder: 'javascripts/app',
      requires: ['LDA.helper.LDAConstants', 'LDA.store.TargetStore',
        'TDGUI.util.LDAConstants', 'TDGUI.store.lda.TargetStore', 'TDGUI.util.TargetReader',
        'TDGUI.store.lda.TargetPharmacologyStore', 'TDGUI.util.TargetPharmacologyReader',
        'TDGUI.controller.Viewport'],

      controllers: ['TDGUI.controller.Viewport', 'TDGUI.controller.SearchPanel'],

      launch: function () {
        console.log("launchinnnnnnnnng: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
      }

    }); // EO Ext.create...

//    console.log("EO beforeEach: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
  }); // EO beforeEach


  describe ('Doing preliminary tests', function () {
    it ('makes a tautology test and definition for myApp TDGUI', function () {
      expect(true).toEqual(true);
      expect(myApp).toBeDefined();
      expect(TDGUI).toBeDefined();

    });

  });


  describe ('TDGUI.util.Utils tests', function () {
    beforeEach (function () {
      arron = Ext.create('TDGUI.util.Person', 'Arron');

      if (!utils)
        utils = Ext.create('TDGUI.util.Utils');
    });

    it ('that an instance was created', function () {
      expect(true).toEqual(true);
//      if (!utils)
  //      utils = Ext.create('TDGUI.util.Utils');
      expect(utils).toBeDefined();
      expect(utils).not.toBeNull();
      expect(utils.isAlive()).toBeTruthy();
    });


    it ('that ops2TargetList method works ok on multiple targets', function () {
      var opsResp = '{"ops_records":[{"pdbimg":"<img src=\\"http://www.rcsb.org/pdb/images/1HLL_asr_r_80.jpg\\" width=\\"80\\" height=\\"80\\" />","proteinFullName":"Alpha-2A adrenergic receptor (Homo sapiens)","accessions":["<a href=\\"http://www.uniprot.org/uniprot/P08913\\" target=\\"_blank\\">P08913</a>","<a href=\\"http://www.uniprot.org/uniprot/B0LPF6\\" target=\\"_blank\\">B0LPF6</a>","<a href=\\"http://www.uniprot.org/uniprot/Q2I8G2\\" target=\\"_blank\\">Q2I8G2</a>","<a href=\\"http://www.uniprot.org/uniprot/Q2XN99\\" target=\\"_blank\\">Q2XN99</a>","<a href=\\"http://www.uniprot.org/uniprot/Q86TH8\\" target=\\"_blank\\">Q86TH8</a>","<a href=\\"http://www.uniprot.org/uniprot/Q9BZK1\\" target=\\"_blank\\">Q9BZK1</a>"],"genes":["ADRA2A","ADRA2R","ADRAR"],"organismSciName":"Homo sapiens","function":"Alpha-2 adrenergic receptors mediate the catecholamine-induced inhibition of adenylate cyclase through the action of G proteins. The rank order of potency for agonists of this receptor is oxymetazoline > clonidine > epinephrine > norepinephrine > phenylephrine > dopamine > p-synephrine > p-tyramine > serotonin = p-octopamine. For antagonists, the rank order is yohimbine > phentolamine = mianserine > chlorpromazine = spiperone = prazosin > propanolol > alprenolol = pindolol."},{"pdbimg":"<img src=\\"http://www.rcsb.org/pdb/images/1WJ6_asr_r_80.jpg\\" width=\\"80\\" height=\\"80\\" />","proteinFullName":"Next to BRCA1 gene 1 protein (Homo sapiens)","accessions":["<a href=\\"http://www.uniprot.org/uniprot/Q14596\\" target=\\"_blank\\">Q14596</a>","<a href=\\"http://www.uniprot.org/uniprot/Q13173\\" target=\\"_blank\\">Q13173</a>","<a href=\\"http://www.uniprot.org/uniprot/Q15026\\" target=\\"_blank\\">Q15026</a>","<a href=\\"http://www.uniprot.org/uniprot/Q5J7Q8\\" target=\\"_blank\\">Q5J7Q8</a>","<a href=\\"http://www.uniprot.org/uniprot/Q96GB6\\" target=\\"_blank\\">Q96GB6</a>","<a href=\\"http://www.uniprot.org/uniprot/Q9NRF7\\" target=\\"_blank\\">Q9NRF7</a>"],"genes":["NBR1","1A13B","KIAA0049","M17S2"],"organismSciName":"Homo sapiens","function":"Acts probably as a receptor for selective autophagosomal degradation of ubiquitinated targets."},{"pdbimg":"<img src=\\"/images/target_placeholder.png\\" width=\\"80\\" height=\\"80\\" />","proteinFullName":"Kita-kyushu lung cancer antigen 1","accessions":["<a href=\\"http://www.uniprot.org/uniprot/Q5H943\\" target=\\"_blank\\">Q5H943</a>"],"genes":["KKLC1","CXorf61"],"organismSciName":"Homo sapiens","function":""},{"pdbimg":"<img src=\\"http://www.rcsb.org/pdb/images/1MMH_asr_r_80.jpg\\" width=\\"80\\" height=\\"80\\" />","proteinFullName":"Adenosine receptor A2a (Homo sapiens)","accessions":["<a href=\\"http://www.uniprot.org/uniprot/P29274\\" target=\\"_blank\\">P29274</a>","<a href=\\"http://www.uniprot.org/uniprot/B2R7E0\\" target=\\"_blank\\">B2R7E0</a>"],"genes":["ADORA2A","ADORA2"],"organismSciName":"Homo sapiens","function":"Receptor for adenosine. The activity of this receptor is mediated by G proteins which activate adenylyl cyclase."},{"pdbImg":"<img src=\\"/images/target_placeholder.png\\" width=\\"80\\" height=\\"80\\" />","genes":[],"accessions":[]}],"totalCount":5,"success":true,"metaData":{"fields":[{"name":"pdbimg","type":"auto"},{"name":"proteinFullName","type":"auto"},{"name":"accessions","type":"auto"},{"name":"genes","type":"auto"},{"name":"organismSciName","type":"auto"},{"name":"function","type":"auto"}],"root":"ops_records"},"columns":[{"text":"PDB","dataIndex":"pdbimg","hidden":false,"filter":{"type":"string"},"width":110,"renderer":"renderPdb"},{"text":"Target name","dataIndex":"proteinFullName","hidden":false,"filter":{"type":"string"},"width":110},{"text":"Accessions","dataIndex":"accessions","hidden":false,"filter":{"type":"string"},"width":110,"xtype":"templatecolumn","tpl":"<tpl for=\\"accessions\\">{.}<br/></tpl>"},{"text":"Genes","dataIndex":"genes","hidden":false,"filter":{"type":"string"},"width":110,"xtype":"templatecolumn","tpl":"<tpl for=\\"genes\\">{.}<br/></tpl>"},{"text":"Organism","dataIndex":"organismSciName","hidden":false,"filter":{"type":"string"},"width":110},{"text":"Target function","dataIndex":"function","hidden":false,"filter":{"type":"string"},"width":110}]}';
      var entries = 'P08913;59aabd64-bee9-45b7-bbe0-9533f6a1f6bc,Q14596;ec79efff-65cb-45b1-a9f5-dddfc1c4025,Q5H943;eeaec894-d856-4106-9fa1-662b1dc6c6f1,P29274;979f02c6-3986-44d6-b5e8-308e89210c8d,-;d7ebde23-00cc-4797-80a2-7688d0d63836';

      var opsRespJson = Ext.JSON.decode(opsResp);
      var recs = utils.opsRecs2ListTarget(opsRespJson, entries);
      expect(recs).toBeDefined();
      expect(recs).not.toBeNull();
      expect(recs.constructor.name).toEqual('Array');
      expect(recs.length).toBeGreaterThan(0);

      Ext.each(recs, function (rec, index, theRecs) {
        expect(rec.fields.containsKey('concept_uuid')).toBeTruthy();
        expect(rec.save).toBeDefined();
      });

      var store = Ext.create('TDGUI.store.ListTargets');
      expect(store).toBeDefined();
      store.loadData(recs);
      expect(store.getCount()).toBeGreaterThan(0);
      expect(store.getCount()).toEqual(store.count());
      expect(store.getAt(0)).toEqual(recs[0]);
    });



    it ('that targetinfo2Listtarget works ok with conceptwiki uuids', function() {
      var resp = '{"pdbimg":"<img src=\\"/images/target_placeholder.png\\" width=\\"80\\" height=\\"80\\" />","proteinFullName":"TP53-regulating kinase","accessions":["<a href=\\"http://www.uniprot.org/uniprot/Q96S44\\" target=\\"_blank\\">Q96S44</a>","<a href=\\"http://www.uniprot.org/uniprot/B3KU44\\" target=\\"_blank\\">B3KU44</a>","<a href=\\"http://www.uniprot.org/uniprot/Q3T977\\" target=\\"_blank\\">Q3T977</a>","<a href=\\"http://www.uniprot.org/uniprot/Q5JZ01\\" target=\\"_blank\\">Q5JZ01</a>","<a href=\\"http://www.uniprot.org/uniprot/Q6NZ60\\" target=\\"_blank\\">Q6NZ60</a>","<a href=\\"http://www.uniprot.org/uniprot/Q96FM7\\" target=\\"_blank\\">Q96FM7</a>","<a href=\\"http://www.uniprot.org/uniprot/Q9NQE6\\" target=\\"_blank\\">Q9NQE6</a>"],"genes":["TP53RK","C20orf64","PRPK"],"organismSciName":"Homo sapiens","function":"Protein kinase that phosphorylates Ser-15 of p53/TP53 protein and may therefore participate in its activation."}';
      var uuid = '2e7a6477-b144-4911-942d-4ccd3ecfbb1a';

      var jsonResp = Ext.JSON.decode(resp);
      var recs = utils.targetInfo2ListTarget(jsonResp, uuid);
      expect(recs).toBeDefined();
      expect(recs).not.toBeNull();
      expect(recs.get('concept_uuid')).not.toBeNull();
      expect(recs.get('concept_uuid')).toContain(uuid);

      var store = Ext.create('TDGUI.store.ListTargets');
      expect(store).toBeDefined();
      store.loadData([recs]);
      expect(store.getCount()).toBeGreaterThan(0);
      expect(store.getAt(0)).toEqual(recs);
    });
    
    
    it ('targetinfo2ListTarget works ok with uniprot accessions', function () {
      var accession = 'Q5H943';
      var resp = '{"pdbimg":"<img src=\\"/images/target_placeholder.png\\" width=\\"80\\" height=\\"80\\" />","proteinFullName":"Kita-kyushu lung cancer antigen 1","accessions":["<a href=\\"http://www.uniprot.org/uniprot/Q5H943\\" target=\\"_blank\\">Q5H943</a>"],"genes":["KKLC1","CXorf61"],"organismSciName":"Homo sapiens","function":""}';

      var jsonResp = Ext.JSON.decode(resp);
      var recs = utils.targetInfo2ListTarget(jsonResp);
      expect(recs).toBeDefined();
      expect(recs).not.toBeNull();
      expect(recs.get('concept_uuid')).not.toBeNull();
      expect(recs.get('concept_uuid')).toEqual('');
      expect(recs.get('uniprot_acc')).toMatch(/[A-Z][A-Z0-9]{5}/);

      var store = Ext.create('TDGUI.store.ListTargets');

      expect(store).toBeDefined();
      store.loadData([recs]);
      expect(store.getCount()).toEqual(1);
      expect(store.getAt(0)).toEqual(recs);

    })

  })
})