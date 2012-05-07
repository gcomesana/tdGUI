
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

// aquí van los tabs
		var tabsSearch = {
      xtype: 'tabpanel',
      activeTab: 0,
      border: false,
      defaults: {
        border: false
      },

      items: [
        {
          title: 'Search',
          bodyPadding: 10,
          padding: '5 10 10 10',
          layout: {
            type: 'hbox',
            align: 'stretch',
            pack: 'start'
          },
          style: 'background-color: lightblue;',
// TODO no se dispone bien la caja/combo y el botón :-S
					items: [
						{
							xtype: 'tdgui-conceptwiki-protein-lookup',
						}, {
							xtype: 'button',
							text: ' GO ',
						}
          ] // EO items
        },
        {
          title: 'Retrieve',
          html : 'Another one'

        }
      ] // EO items
    } // EO tabsSearch

    me.items = [tabsSearch]
    me.callParent (arguments)
  }

//  items: theWestItems
})