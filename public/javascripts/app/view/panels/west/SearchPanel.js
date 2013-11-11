
/**
 * @class TDGUI.view.panels.west.SearchPanel
 * @extends Ext.panel.Panel
 * @alias widget.tdgui-west-search
 *
 * This panel supports all components at the left of the page ('west' region in
 * an border layout).
 */
Ext.define ('TDGUI.view.panels.west.SearchPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-west-search',
	requires: ['TDGUI.view.dropdowns.tdgui.ConceptWikiProteinLookup',
             'TDGUI.view.dropdowns.tdgui.CheckboxComboProteinLookup',
             'TDGUI.view.common.Textarea',
             'Ext.ux.form.MultiSelect', 'TDGUI.view.common.ItemMultilist'],
//             'TDGUI.view.panels.PanelButtons'],

//	region: 'west',
//  collapsible: true,
//  title: 'Search center',
//  split: true,
//  width: '20%',
//  minWidth: 300,
//  minHeight: 500,
  /**
   * @cfg {Boolean} [border=false] the border of this panel
   */
  border: false,
  /**
   * @cfg {String} margin the margin values applied to the HTML element supporting this panel
   */
  margin: '30px 0px 0px 0px',

  /**
   * @cfg {String} anchor As this component is defined as an item at {@link TDGUI.view.Viewport}
   * the configured layout is Anchor layout and this is the property to configure this
   * component using that anchor. In this case, the component expanda all along and
   * wide the west border of the container
   */
  anchor: '100% 100%',

  /**
   * @cfg defaults Same as {@link TDGUI.view.Viewport#defaults}
   */
  defaults: {
    border: false
  },
//            html: 'west<br>I am floatable',
/*
Example snippet:
this.items = [
    grid = Ext.widget('dynamicgrid')
];
grid.buttonRender(['new', 'edit', 'filter', 'delete', 'load', 'exporter']);
this.callParent(arguments);
*/


  initComponent: function () {
  	var me = this
console.info ("Initializing panels.west.SearchPanel + Tabs comp...")

//    me.items = [this.createTabs()]
    me.items = [
      this.createLabel(),
      this.createSearchTab(),
      this.createRetrievingTab()
    ]
    me.callParent (arguments)
  }, // EO initComponent




// METHODS TO CREATE INNER COMPONENTS ////////////////////////////////////////
  /**
   * Creates a Ext.form.Label component and set a property on this class referencing the
   * label.
   * @return {Ext.form.Label} the created label
   */
  createLabel: function () {
    this.exampleLabel = Ext.create ('Ext.form.Label', {
      text: 'Semantic search',
      margin: 10,

      listeners: {
        'afterrender': function (thisCmp, objOpts) {

          var lbEl = thisCmp.getEl()
          lbEl.on ('click', function() {
            thisCmp.fireEvent ('click', thisCmp)
          })
        }
      },

      initComponent: function () {
//        this.addEvents ('click')

        this.callParent (arguments)
      }
    })

    return this.exampleLabel
  },



  /**
   * Actually, it creates a Ext.panel.Panel to support a {@link TDGUI.view.dropdowns.tdgui.CheckboxComboProteinLookup}
   * and a button and return the created component to be a property of the main panel
   * The search panel features a column layout
   * @return {Ext.panel.Panel} the panel with a combo-textfield and a button
   */
  createSearchTab: function () {
    this.searchTab = Ext.create ('Ext.panel.Panel', {
//      title: 'Search',
//      renderTo: Ext.getBody(),
//      width: 400,
//      height: 200,
      bodyPadding: '0 0 10 0',
      border: false,

//      closable: true,

      items: [{
//          title: 'Search',
        frameHeader: false,
        border: false,
//        bodyPadding: 5,
        padding: '5 10 10 10', // padding for this panel
        layout: 'column',
//          style: 'background-color: lightblue;',

        items: [{
//            xtype: 'tdgui-conceptwiki-protein-lookup',
            xtype: 'tdgui-chkbox-combo-proteinlookup',
            columnWidth: .85,
            enableKeyEvents: true
          }, {
            xtype: 'button',
            text: ' Add ',
            columnWidth: .15,
            action: 'query-protein-info',
            disabled: true
        }] // EO items

      }]
    });

    return this.searchTab
  },


  /**
   * As for exemplar purposes, we create a initial list of targets and initialize
   * a {@see TDGUI.store.ListTargets} with the targets.
   * In addition and using the store, a {@see TDGUI.view.common.ItemMultilist}
   * is created and returned
   * @return {TDGUI.view.common.ItemMultilist} a item list to show the target list elements
   */
  createTargetList: function () {
    var myData = [{
      name: "TP53-regulated inhibitor of apoptosis 1",
      concept_uuid: "d593db45-e954-4e97-94f7-c039350f97f4",
      concept_uri: "http://www.conceptwiki.org/concept/d593db45-e954-4e97-94f7-c039350f97f4",
      uniprot_acc: ["<a href=\"http://www.uniprot.org/uniprot/O43715\" target=\"_blank\">P08913</a>",
        "<a href=\"http://www.uniprot.org/uniprot/B2R4Z7\" target=\"_blank\">B2R4Z7</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q5RKS5\" target=\"_blank\">Q5RKS5</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q6LCA7\" target=\"_blank\">Q6LCA7</a>"],
      uniprot_id: "TRIA1_HUMAN",
      uniprot_name: "TRIA1_HUMAN"
    }, {
      name: "Next to BRCA1 gene 1 protein (Homo sapiens)",
      concept_uuid: "ec79efff-65cb-45b1-a9f5-dddfc1c4025c",
      concept_uri: "http://www.conceptwiki.org/concept/ec79efff-65cb-45b1-a9f5-dddfc1c4025c",
      uniprot_acc: ["<a href=\"http://www.uniprot.org/uniprot/Q14596\" target=\"_blank\">Q14596</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q13173\" target=\"_blank\">Q13173</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q15026\" target=\"_blank\">Q15026</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q5J7Q8\" target=\"_blank\">Q5J7Q8</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q96GB6\" target=\"_blank\">Q96GB6</a>",
        "<a href=\"http://www.uniprot.org/uniprot/Q9NRF7\" target=\"_blank\">Q9NRF7</a>"
      ],
      uniprot_id: "NBR1_HUMAN",
      uniprot_name: "NBR1_HUMAN"
    }, {
    	name: "Kita-kyushu lung cancer antigen 1 (Homo sapiens)",
    	concept_uuid: "eeaec894-d856-4106-9fa1-662b1dc6c6f1",
    	concept_uri: "http://www.conceptwiki.org/concept/eeaec894-d856-4106-9fa1-662b1dc6c6f1",
    	uniprot_acc: ["<a href=\"http://www.uniprot.org/uniprot/Q5H943\" target=\"_blank\">Q5H943</a>"], // uniprot_acc: "Q5H943",
    	uniprot_id: "KKLC1_HUMAN", // uniprot_id: "KKLC1_HUMAN"
      uniprot_name: "KKLC1_HUMAN"
    }, {
      name: "Adenosine receptor A2a (Homo sapiens)",
      concept_uuid: "979f02c6-3986-44d6-b5e8-308e89210c8d",
      concept_uri: "http://www.conceptwiki.org/concept/979f02c6-3986-44d6-b5e8-308e89210c8d",
      uniprot_acc: ["<a href=\"http://www.uniprot.org/uniprot/P29274\" target=\"_blank\">P29274</a>",
        "<a href=\"http://www.uniprot.org/uniprot/B2R7E0\" target=\"_blank\">B2R7E0</a>"
      ], // uniprot_acc: "Q5H943",
      uniprot_id: "AA2AR_HUMAN", // uniprot_id: "KKLC1_HUMAN"
      uniprot_name: "AA2AR_HUMAN"
    }]


//////////////////////////////////////////////////////////////
    myData = [{
      name: "Alpha-2A adrenergic receptor",
      concept_uuid: "59aabd64-bee9-45b7-bbe0-9533f6a1f6bc",
      concept_uri: "http://www.conceptwiki.org/concept/59aabd64-bee9-45b7-bbe0-9533f6a1f6bc",
      uniprot_acc: ["P08913",     "B0LPF6",    "Q2I8G2",  "Q2XN99","Q86TH8","Q9BZK1"],
      uniprot_id: "TRIA1_HUMAN",
      uniprot_name: "TRIA1_HUMAN"
    }, {
      name: "Next to BRCA1 gene 1 protein (Homo sapiens)",
      concept_uuid: "ec79efff-65cb-45b1-a9f5-dddfc1c4025c",
      concept_uri: "http://www.conceptwiki.org/concept/ec79efff-65cb-45b1-a9f5-dddfc1c4025c",
      uniprot_acc: ["Q14596",
        "Q13173",
        "Q15026",
        "Q5J7Q8",
        "Q96GB6",
        "Q9NRF7"
      ],
      uniprot_id: "NBR1_HUMAN",
      uniprot_name: "NBR1_HUMAN"
    }, {
      name: "Kita-kyushu lung cancer antigen 1 (Homo sapiens)",
      concept_uuid: "eeaec894-d856-4106-9fa1-662b1dc6c6f1",
      concept_uri: "http://www.conceptwiki.org/concept/eeaec894-d856-4106-9fa1-662b1dc6c6f1",
      uniprot_acc: ["Q5H943"], // uniprot_acc: "Q5H943",
      uniprot_id: "KKLC1_HUMAN", // uniprot_id: "KKLC1_HUMAN"
      uniprot_name: "KKLC1_HUMAN"
    }, {
      name: "Adenosine receptor A2a (Homo sapiens)",
      concept_uuid: "979f02c6-3986-44d6-b5e8-308e89210c8d",
      concept_uri: "http://www.conceptwiki.org/concept/979f02c6-3986-44d6-b5e8-308e89210c8d",
      uniprot_acc: ["P29274",
        "B2R7E0"
      ], // uniprot_acc: "Q5H943",
      uniprot_id: "AA2AR_HUMAN", // uniprot_id: "KKLC1_HUMAN"
      uniprot_name: "AA2AR_HUMAN"
    }];

    var initStore = Ext.create('TDGUI.store.ListTargets');
    initStore.loadData(myData);

    this.targetList = Ext.create ('TDGUI.view.common.ItemMultilist', {
      listName: 'Target List',
      id: 'targetListId',
      store: initStore,
      displayField: 'display_field',
      valueField: 'uniprot_acc'
    });

		// Add a context menu for this list
		var theTargetList = this.targetList;
		theTargetList.on('afterrender', function(comp, opts) {
			var multilist = theTargetList.down('multiselect');
			var corelist = multilist.boundList; // this is the boundlist which is the real list view component

			// menu definition
			var listContextMenu = Ext.create('Ext.menu.Menu', {
				id: 'listTargetMenu',
				style: {
					overflow: 'visible' // Modifies the style
				},
				items: [{
						text: 'Target <b>info</b>',
						id: 'targetInfoMenuitem',
						handler:  function (item, ev) {
							ev.stopEvent();
							var itemList = this.up('tdgui-item-multilist'); // bad
							this.fireEvent('targetinfoMenuEv', {item: item});
						}
					}, {
						text: 'Target <b>interactions</b>',
						id: 'targetInteractionsMenuitem',
						// menu: colorMenu // <-- submenu by reference
						handler: function (item, ev) {
							ev.stopEvent();
							this.fireEvent('targetinteractionsMenuEv', {item: item});
						}
					}
				]
			});

			// context menu show on right button click
			corelist.on('beforeitemcontextmenu', function(comp, record, item, index, ev, opts) {
				ev.stopEvent();
				Ext.each(listContextMenu.items.keys, function(menuItemId, index, keys) {
					var menuItem = listContextMenu.items.getByKey(menuItemId);
					menuItem.data = record.raw;
				})
				listContextMenu.showAt(ev.getXY());
			});
		}); // afterrender

    this.targetList.addDockedItem({
      xtype: 'button',
      text: 'Search'
    });

    return this.targetList;
  },


/*
  createTextarea: function () {
    this.textareaCode = Ext.widget ('tdgui-textarea', {
      anchor: '100% 80%',
      value: 'Q13362\nP12345\nP0AEN3\nP0AEN2\nP0AEN1'
//      disabled: true
    })

    return this.textareaCode
  },
*/


  /**
   *
   * @param strTargets
   */
  setTargetList: function (strTargets) {

  },



  /**
   * Creates the panel supporting the list returned by
   * {@see TDGUI.view.panels.wes.SearchPanel#createTargetList}
   * @return {Ext.panel.Panel} a new panel for the target list plus search button
   */
  createRetrievingTab: function () {
    var me = this
    this.retrievingTab = Ext.create ('Ext.panel.Panel', {
//      title: 'Retrieve',
//      width: 400,
//      height: 300,
      padding: '5 10 10 10',
      layout: 'anchor',
      frameHeader: false,
      border: false,
//      closable: true,


      items: [
        this.createTargetList()
        /*
        me.retrievingButtons = Ext.widget ('tdgui-panelbuttons', {
          anchor: '100%',
          rightButtonName: ' GO ',
          leftButtonName: 'Reset'
        })
        */
      ]
    })

    return this.retrievingTab
  },



// NOT used currently, as all search boxes are place on a single panel
  createTabs: function () {
    this.tabsSearch = Ext.create ('Ext.tab.Panel', {
      activeTab: 1,
      width: '100%',
//      width: 400,

      items: [
        this.createSearchTab(),
        this.createRetrievingTab()
        /*
        {
          title: 'Retrieve',
          html : 'Another one'
      }*/] // EO items
    }) // EO tabsSearch

    return this.tabsSearch
  }


// items: theWestItems
})