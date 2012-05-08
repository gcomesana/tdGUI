
Ext.define ('TDGUI.view.panels.west.SearchPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-west-search',
	requires: ['TDGUI.view.dropdowns.tdgui.ConceptWikiProteinLookup'],

//	region: 'west',
  collapsible: true,
  title: 'Mission control',
  split: true,
  width: '20%',
  minWidth: 300,
  minHeight: 200,
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
/*
    var mainPanel = Ext.create ('Ext.panel.Panel', {
      title: 'Search',
      renderTo: Ext.getBody(),
      width: 400,
      height: 200,

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


// aquí van los tabs
		var tabsSearch = {
      xtype: 'tabpanel',
      activeTab: 0,
      border: false,
      defaults: {
        border: false
      },

      items: [
          this.createSearchTab(), {
          title: 'Retrieve',
          html : 'Another one'
      }] // EO items
    } // EO tabsSearch
*/
    me.items = [this.createTabs()]
    me.callParent (arguments)
  },


  createLabel: function () {
    this.exampleLabel = Ext.create ('Ext.form.Label', {
      text: 'Click on me!!!',
      margin: '0 0 0 15',

      listeners: {
        'afterrender': function (thisCmp, objOpts) {
          var lbEl = thisCmp.getEl()
          lbEl.on ('click', function() {
            console.info ('label clicked with '+arguments.length+' arguments')
          })
        }
      }
    })

    return this.exampleLabel
  },


  createSearchTab: function () {
    this.searchTab = Ext.create ('Ext.panel.Panel', {
      title: 'Search',
      renderTo: Ext.getBody(),
      width: 400,
      height: 200,

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
      xtype: 'tabpanel',
      activeTab: 0,
      border: false,
      defaults: {
        border: false
      },

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