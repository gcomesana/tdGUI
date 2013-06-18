/**
 * @class TDGUI.view.panels.TargetInfo
 * @extend Ext.panel.Panel
 * @alias widget.tdgui-targetinfopanel
 *
 * This is the entire 'Target by name' panel. Displays information about the
 * chosen target
 */
Ext.define('TDGUI.view.panels.TargetInfo', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-targetinfopanel',
  requires: ['TDGUI.store.lda.TargetStore', 'HT.lib.Util'],
  
	title: 'Target Info',

  /**
   * @cfg {String} anchor the properties for the anchor layout
   */
	anchor: '100% 100%',
	autoScroll: true,
	bodyPadding: '10px',
	layout: 'anchor',

  /**
   * @cfg {Object} targetInfoStore this is intended to be an store where store
   * the properties for this target
   */
  targetInfoStore: null,

// This config is used to count the numbers of requests in order to fill this
// component with data.
// As by 07.2012, only there will be two sources (coreAPI and uniprot) but
// this is here in the case of we can add more in the future (chembl, f.ex.)
// The requested URIs are in the queryParam config property
  numOfReqs: 0,

/**
 * @cfg {String} concept_uuid this is a necessary config, got from the multitarget
 * component, in order to be able to set the pharma_button with the necessary parameters
 * to get pharmacological info from coreAPI / LDA
 */
  concept_uuid: undefined,

  /**
   * @cfg {String} uniprot_acc And this is necessary in order to perform the target interactions operation
   */
  uniprot_acc: undefined,

	initComponent: function() {
// set concept_uuid and uniprot_acc from
// "http://www.conceptwiki.org/concept/ec79efff-65cb-45b1-a9f5-dddfc1c4025c,http://www.uniprot.org/uniprot/Q14596"
    var qparams = this.queryParam.split(',');
    this.uniprot_acc = qparams[1].substring(qparams[1].lastIndexOf('/')+1, qparams[1].length)
    this.concept_uuid = qparams[0].substring(qparams[0].lastIndexOf('/')+1, qparams[0].length)


    var me = this
		this.items = [{
			xtype: 'panel',
			border: 0,
			layout: 'anchor',
			autoScroll: true,
			itemId: 'dp',
			bodyPadding: '10px',
			cls: 'target-data-panel',
			hidden: true,

			items: [{
				xtype: 'panel',
				border: 0,
				anchor: '100%',
				itemId: 'topPanel',
				layout: 'column',
				autoScroll: true,

				items: [{
					xtype: 'image',
					itemId: 'target_image',
					width: 150,
					height: 150,
					src: '/images/target_placeholder.png'
				}, {
					xtype: 'panel',
					bodyPadding: 30,
					columnWidth: 1.0,
					border: 0,
					autoScroll: true,
					itemId: 'textDataPanel',
					layout: 'anchor',

					items: [{
						xtype: 'displayfield',
						anchor: '100%',
//						itemId: 'target_name',
            itemId: 'prefLabel',
						fieldCls: 'target-title'
					}, {
            xtype:'button',
            text:'Pharmacology Data',
            itemId:'pharmTargetButton',
            cls:'target-pharm-button'
          }, {
            xtype:'button',
            text:'Interactions Data',
            itemId:'stringdbTargetButton',
            cls:'target-pharm-button',
            handler: this.raiseInteractionParams
          }, {
            xtype:'button',
            text:'Pathway Data',
            itemId:'pathwayTargetButton',
            cls:'target-pharm-button',
            disabled: true
          }, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'target_type',
						fieldLabel: 'Target Type',
						cls: 'target-field-label',
            hidden: true

					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'organism',
						fieldLabel: 'Organism',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'description',
						fieldLabel: 'Description',
						cls: 'target-field-label',
            hidden: true
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'synonyms',
						fieldLabel: 'Synonyms',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'specific_function',
						fieldLabel: 'Specific Function',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
//						itemId: 'cellularLocations',
//						fieldLabel: 'Cellular Location(s)',
            itemId: 'cellular_function',
            fieldLabel: 'Cellular Function',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'keywords',
						fieldLabel: 'Keywords',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'pdb_id_page',
						fieldLabel: 'PDB Entry',
						cls: 'target-field-label'
					}, {
						xtype: 'panel',
						border: 0,
						anchor: '100%',
						itemId: 'numericDataPanel',
						layout: 'column',
						bodyPadding: 30,

						items: [{
							xtype: 'displayfield',
							itemId: 'molecular_weight',
							columnWidth: 0.33,
							fieldLabel: 'Molecular Weight',
							cls: 'target-field-bottom',
							fieldCls: 'target-field-bottom-field',
							labelAlign: 'top',
              hidden: true
						}, {
							xtype: 'displayfield',
							itemId: 'number_of_residues',
							columnWidth: 0.33,
							fieldLabel: 'Number of Residues',
							cls: 'target-field-bottom',
							fieldCls: 'target-field-bottom-field',
							labelAlign: 'top',
              hidden: true
						}, {
							xtype: 'displayfield',
							itemId: 'theoretical_pi',
							columnWidth: 0.33,
							fieldLabel: 'Theoretical Pi',
							cls: 'target-field-bottom',
							fieldCls: 'target-field-bottom-field',
							labelAlign: 'top',
              hidden: true
						}]
					}]
				}

				]
			}]
		}, {
			xtype: 'displayfield',
			border: 0,
			padding: '20px',
			itemId: 'msg',
			//                anchor:'100% 100%',
			region: 'center',
			hidden: true,
			fieldCls: 'target-message',
			value: 'message here'
		}];


    this.title = window.decodeURI(this.title)

// *** Store initialization:
// Mind the name of the fields in the store are the same than the names of the
// displayfields in here!!!!
//		var store = Ext.data.StoreManager.lookup('Targets');
//    var store = Ext.create ('TDGUI.store.Targets');
    var store = Ext.create ('TDGUI.store.lda.TargetStore');
    this.targetInfoStore = store;
//		store.addListener('load', this.showData, this);
    this.targetInfoStore.addListener('load', this.showData, this); // load is in TargetInfo controller:afterrender
//    this.targetInfoStore.addListener('load', this.displayData, this);
		this.callParent(arguments);
	},
	// EO initComponent


  /**
   * Display a dialog requesting for parameters for yielding the interaction network
   * (specifically interaction confidence value and max number of nodes)
   * @param {Ext.Component} btn the component source of the event (specifically a button)
   * @param {Event} ev the event information
   */
  raiseInteractionParams: function (btn, ev) {

    var panel = btn.up('tdgui-targetinfopanel');

    var me = panel;
    console.info('accession for targetinfo-panel: '+me.uniprot_acc);
    var form = Ext.createWidget('form', {
      bodyPadding: 5,
      frame: true,
      width: 200,


      fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 105,
        anchor: '100%'
      },

      items: [
        {
          xtype: 'numberfield',
          fieldLabel: 'Confidence value',
          name: 'conf_val',
          hideTrigger: true,
          minValue: 0,
          maxValue: 1,
          allowDecimals: true,
          decimalPrecision: 2,
          value: 0.43
        },
        {
          xtype: 'numberfield',
          hideTrigger: true,
          fieldLabel: 'Max neighbours',
          name: 'max_nodes',
          allowDecimals: false,
          maxValue: 10,
          minValue: 2,
          value: 5
        }, {
          xtype: 'hiddenfield',
          name: 'uniprotAcc',
          value: me.uniprot_acc
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          id: 'interactionCancelBtn',
          handler: function () {
            var me = this
            me.up('form').getForm().reset();
            me.up('window').close();
          }
        }, {
          text: 'Send',
          id: 'interactionSendBtn'
        }
      ]
    });


		var interactionDlgId = 'interactionsDlg';
/*		var myInteractionsDlg = Ext.getCmp(interactionDlgId);
		if (myInteractionsDlg !== undefined && this.interactionDlg === undefined)
			this.interactionDlg = myInteractionsDlg;

		else if (this.interactionDlg === undefined) {
*/
			this.interactionDlg = Ext.widget('window', {
				title: 'Interactions parameters',
				closeAction: 'destroy',
				id: interactionDlgId,
				width: 250,
				height: 150,
	//      height: 400,
	//      minHeight: 400,
				layout: 'fit',
				resizable: true,
				modal: true,
				items: form
			});

    this.interactionDlg.show()

  },


  /**
   * Reset all display fields (where target information is displayed). This is
   * done in order to set information for a different target than the current one
   * @deprecated No longer useful as different target information is displayed in different tabs
   */
	resetAllFields: function() {
		var displayFields = this.query('displayfield');
		Ext.each(displayFields, function(field) {
			field.hide();
		}, this);
		var img = this.down('#target_image');
		img.setSrc('images/target_placeholder.png');
		this.doLayout();
	},



	showMessage: function(message) {
		var dp = this.down('#dp');
		var msg = this.down('#msg');

		dp.setVisible(false);
		msg.setValue(message);
		msg.setVisible(true);
	},


  /**
   * Set the data for the current target on the right display fields. This is usually
   * a callback method for some store event (as onload event, i.e.)
   * @param {Ext.data.Store} store the store where the data is to be retrieved
   * @param {Array} records the records of teh store as a Ext.data.Model array
   * @param {Boolean} successful
   * @deprecated just used at coreGUI application, not in TDGUI
   */
  displayData:function (store, records, successful) {
    if (successful) { // not necessary after LDA-> && records[0].data.hasOwnProperty('target_name')) {
//      if (records.length > 0) {
      var dp = this.down('#dp');
      var msg = this.down('#msg');
      msg.setVisible(false);
      this.setValues(store.first());
      dp.setVisible(true);
      /*      }
       else
       this.showMessage('No records found within OPS for this search');
       */
    }
    else {
//			this.showMessage('Server did not respond');
      var prevReq = store.proxy.extraParams.protein_uri
      var nextReq = this.queryParam.split(',')
      if (nextReq.length > 1 && nextReq != prevReq) {
        this.numOfReqs++
        this.fireEvent('opsFailed', this, {concept_req: nextReq[this.numOfReqs]})
      }
      // else raise a message with no information found...
    }

    this.endLoading();
// var targetInfos = Ext.ComponentQuery.query('tdgui-targetinfopanel')
// console.info ("targetinfos length: "+targetInfos.length)

  },


  /**
   * Show data as the #displayData method
   * @param store
   * @param records
   * @param successful
   */
  showData: function (store, records, successful) {
  	var me = this;

    if (successful) {
      var td = store.first().data;

      if (records.length > 0 && td.hasOwnProperty('prefLabel')) { // TEMP FIX -- new coreAPI's returning an empty object

        var dp = this.down('#dp');
        var msg = this.down('#msg');
        msg.setVisible(false);
        this.setValues(store.first());
        dp.setVisible(true);

      }
      else {
        this.showMessage('No records found within OPS for this search');
      }
      this.endLoading();
    }
    else {
    	// try uniprot_by_acc
    	var url = 'http://localhost:3003/api/target/'+this.uniprot_acc+'.jsonp';
    	Ext.data.JsonP.request({
    		url: url,

    		failure: function (resp, opts) {
					me.showMessage ('Unable to get information for protein with accession '+me.uniprot_acc);
					me.endLoading();
				},

				// In this case, we just check if the gene names match
				success: function (resp, opts) {
					var jsonObj = resp;

					if (jsonObj == null)
						me.showMessage ('Unable to get iformation for protein with accession '+me.uniprot_acc);
					else {
						var dp = me.down('#dp');
		        var msg = me.down('#msg');
		        msg.setVisible(false);
		        // me.setValues(jsonObj);
		        var pharmButton = me.down('#pharmTargetButton');
		        pharmButton.disable();
		        dp.setVisible(true);

		        me.addSynonyms(jsonObj.genes);
				    me.addOrganism(jsonObj.organismSciName);
						me.addPDBImage(jsonObj.pdbimg);

						var specFuncField = me.down('#specific_function');
						specFuncField.setValue(jsonObj.function);
						specFuncField.show();
						specFuncField.setVisible(true);

						var labelFuncField = me.down('#prefLabel');
						labelFuncField.setValue(jsonObj.proteinFullName);
						labelFuncField.show();
						labelFuncField.setVisible(true);

						me.addPDBImage(jsonObj.pdbimg);

						me.endLoading();
					}
				} // EO success
    	}); // EO jsonp request
      
    } // EO else
//    this.endLoading();

  },


  /**
   * Handy method to remove all dom domeElement's children elements
   * @param {Ext.Element} domElement a dom element
   */
  clearDomBelow: function(domElement) {
		if (domElement.hasChildNodes()) {
			while (domElement.childNodes.length > 0) {
				domElement.removeChild(domElement.firstChild);
			}
		}
	},


  /**
   * Display the keywords for the current target
   * @param {String} keywords a semi-colon separated list of keywords
   */
	addKeywords: function(keywords) {
		var bits;
		if (HT.lib.Util.isClassOf(keywords, 'String'))
			bits = keywords.split('; ');
		else
			bits = keywords;
		
		var keywordDisplayField = this.down('#keywords');
		var bodyEl = keywordDisplayField.bodyEl;
		var domElem = bodyEl.dom;
		this.clearDomBelow(domElem);
		var tpl = Ext.DomHelper.createTemplate({
			tag: 'div',
			cls: 'keyword',
			html: '{kw}'
		});

    if (bits.length > 0) {
      Ext.each(bits, function(keyword) {
        tpl.append(bodyEl, {
          kw: keyword
        });
      }, this);
    }

		keywordDisplayField.show();
	},


  /**
   * Set the organism field to the value for the current target
   * @param {String} organism the organism name
   */
	addOrganism: function(organism) {
		var organismDisplayField = this.down('#organism');
		var bodyEl = organismDisplayField.bodyEl;
		var domElem = bodyEl.dom;
		this.clearDomBelow(domElem);
		var tpl = Ext.DomHelper.createTemplate({
			tag: 'div',
			cls: 'organism',
			html: '{org}'
		});
		tpl.append(bodyEl, {
			org: organism
		});
		organismDisplayField.show();
	},


  /**
   * Add synonim terms for the current target (see #addKeywords)
   * @param {Array} synonyms
   */
	addSynonyms: function(synonyms) {
		var bits;
		if (Object.prototype.toString.call(synonyms).match(/\s([a-zA-Z]+)/) == 'String')
			bits = synonyms.split('; ');
		else
			bits = synonyms;

		var synonymsField = this.down('#synonyms');
		var bodyEl = synonymsField.bodyEl;
		var domElem = bodyEl.dom;
		this.clearDomBelow(domElem);
		var tpl = Ext.DomHelper.createTemplate({
			tag: 'div',
			cls: 'synonym',
			html: '{syn}'
		});
		Ext.each(bits, function(synonym) {
			tpl.append(bodyEl, {
				syn: synonym
			});
		}, this);
		synonymsField.show();
	},


  /**
   * Set the pdb image based on the pdb id.
   * @param {String} pdbIdPage a pdb url for the image
   */
	addPDBImage: function(pdbIdPage) {
		// example http://www.pdb.org/pdb/explore/explore.do?structureId=1HOF
		//         http://www.rcsb.org/pdb/images/1HOF_asr_r_250.jpg
		// for Uniprot retrieved info: <img src=\"http://www.rcsb.org/pdb/images/2Y6E_asr_r_80.jpg\" width=\"80\" height=\"80\" />
    if (pdbIdPage.length == 0 || pdbIdPage.indexOf('http') == -1)
      return;

		var stringURL = new String(pdbIdPage);
		var img = this.down('#target_image');
		var pdbID;
		if (stringURL.indexOf('<img') == 0) {
			var initPdbId = stringURL.indexOf('s/');
			var endPdbId = stringURL.indexOf('_asr', initPdbId);
			pdbID = stringURL.substring(initPdbId+2, endPdbId);

			pdbIdPage = 'http://www.pdb.org/pdb/explore.do?structureId='+pdbID;			
		}
		else {
			var pdbID = stringURL.substr(stringURL.lastIndexOf('=') + 1);
	    if (pdbID == pdbIdPage)
	      pdbID = stringURL.substr(stringURL.lastIndexOf('/') + 1);
	  }

		var pdbField = this.down('#pdb_id_page');
		pdbField.setRawValue('<a target=\'_blank\' href=\'' + pdbIdPage + '\'>' + pdbID + '</a>');
		pdbField.show();
		img.setSrc('http://www.rcsb.org/pdb/images/' + pdbID + '_asr_r_250.jpg');
		img.show();
	},


  /**
   * Set information fields for the current target
   * @param {String} fieldId the field identifier
   * @param {String} value the value for that field
   */
	setFieldValue: function(fieldId, value) {
		if (fieldId == 'synonyms') {
			//            console.log('synonyms');
      if (value != null && value.length > 0)
			  this.addSynonyms(value);
		}
    else if (fieldId == 'keywords') {
			//            console.log('keywords');
      if (value != null && value.length > 0)
			  this.addKeywords(value);
		}
    else if (fieldId == 'organism') {
			//            console.log('organism');
			if (value != null && value.length > 0)
        this.addOrganism(value);
		}
    else if (fieldId == 'pdb_id_page') {
			if (value != null && value.length > 0)
        this.addPDBImage(value);
		}
    else {
// console.log('standard field: '+fieldId+' -> '+value);
			var field = this.down('#' + fieldId);
			if (field != null) {
        field.setValue(value);
        field.show();
        field.setVisible(true);
      }

		}
	},


/**
 * Set the target info data on the panel info and, in addition, sets the handler
 * for the pharma button (BAD: it should be on the controller)
 * @param target, the very first record retrieved with target info data
 */
	setValues: function(target) {
		this.resetAllFields();
		var td = target.data;

// Pharmacology data button initialization
    var pharmButton = this.down('#pharmTargetButton');
    var protein_uri = target.store.proxy.extraParams.protein_uri

// get the concept_uri for pharma_button. it will be such as
// conceptwiki.org/concept/<concept_uuid>

//    if (protein_uri.indexOf("uniprot") == -1) {
    if (this.concept_uuid != undefined && this.concept_uuid.length > 0) {
      var targetName = target.get('target_name') || target.get('prefLabel');
      var pharmaURI = 'http://www.conceptwiki.org/concept/'+this.concept_uuid;

      pharmButton.hide();
      pharmButton.setHandler(function () {
  // console.info('pharmButton.setHandler -> !xt=tdgui-pharmbytargetpanel&qp=' + target.store.proxy.extraParams.protein_uri)
        var historyParams = '!xt=tdgui-pharmbytargetpanel&qp=' +pharmaURI;
        historyParams += '&tg=' + targetName;
        historyParams += '&dc=' + Math.random();

        Ext.History.add(historyParams);
      });
    }
    else
      pharmButton.disable()

    pharmButton.show();

    for (var prop in td) {
			if (td.hasOwnProperty(prop)) {
				//                console.log(prop);
				this.setFieldValue(prop, td[prop]);
			}
		}

		//        if (td.target_name) {
		//            this.setFieldValue('#tn', td.target_name);
		//        }
		//
		//        if (td.target_type) {
		//            this.setFieldValue('#tt', td.target_type);
		//        }
		//
		//        var typeField = this.down('#tt');
		//        typeField.setValue(td.target_type);
		//
		//        var descField = this.down('#desc');
		//        descField.setValue(td.description);
		//
		//        var keyField = this.down('#key');
		//        this.addKeywords(td.keywords, keyField);
		//
		//        var orgField = this.down('#org');
		//        this.addOrganism(td.organism, orgField);
		//
		//        var synField = this.down('#syn');
		//        this.addSynonyms(td.synonyms, synField);
		//
		//        if (td.cellularLocation) {
		//            var cellLoc = this.down('#cl');
		//            cellLoc.setValue(td.cellularLocation);
		//            cellLoc.show();
		//        }
		this.doLayout();
	},


	startLoading: function() {
console.info ('TargetInfo.startLoading')
		this.setLoading({msg: 'Loading data...'}, true);
	},


  endLoading: function() {
console.info ('TargetInfo.endLoading')
		this.setLoading(false);
	}

});
