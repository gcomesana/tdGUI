
Ext.define ('TDGUI.view.panels.west.SearchPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-west-search',
	requires: ['TDGUI.view.dropdowns.tdgui.ConceptWikiProteinLookup'],

//	region: 'west',
  collapsible: true,
  title: 'Search center',
  split: true,
  width: '20%',
  minWidth: 300,
  minHeight: 200,
  border: false,

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


    me.items = [this.createTabs()]
    me.callParent (arguments)
  }, // EO initComponent




// METHODS TO CREATE COMPONENTS ////////////////////////////////////////////////////
  createLabel: function () {
    this.exampleLabel = Ext.create ('Ext.form.Label', {
      text: 'Click for examples!!!',
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
        this.addEvents ('click')

        this.callParent (arguments)
      }
    })
//    this.exampleLabel.addEvents ('click')

    return this.exampleLabel
  },



  createSearchTab: function () {
    this.searchTab = Ext.create ('Ext.panel.Panel', {
      title: 'Search',
      renderTo: Ext.getBody(),
      width: 400,
      height: 200,
      bodyPadding: '15 0 10 0',

      items: [this.createLabel(), {
//          title: 'Search',
        frameHeader: false,
        bodyPadding: 5,
        padding: '5 10 10 10', // padding for this panel
        layout: 'column',
//          style: 'background-color: lightblue;',

        items: [{
            xtype: 'tdgui-conceptwiki-protein-lookup',
            columnWidth: .85
          }, {
            xtype: 'button',
            text: ' GO ',
            columnWidth: .15
        }] // EO items

      }]
    })

    return this.searchTab
  },



  createTabs: function () {
    this.tabsSearch = Ext.create ('Ext.tab.Panel', {
      activeTab: 0,
      width: '100%',

      items: [
          this.createSearchTab(), {
          title: 'Retrieve',
          html : 'Another one'
      }] // EO items
    }) // EO tabsSearch

    return this.tabsSearch

  }


// items: theWestItems
})