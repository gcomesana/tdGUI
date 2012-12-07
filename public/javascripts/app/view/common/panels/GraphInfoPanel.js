
// TODO class to remove, no longer used
// Ext.Loader.setPath('Ext.ux', 'extjs4.0.7/ux');
Ext.require(['Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector']);

Ext.define ('TDGUI.view.common.panels.GraphInfoPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-graphinfopanel',

//  id: 'graphInfoPanel',
//  border: false,
//  title: 'Selected graph elements',
//  frameHeader: false,
//  html: '<h1>This is the info panel',
  flex: 1,
  layout: 'anchor',
  store: undefined,
  title: 'Information panel (GraphInfoPanel)',


  initComponent: function () {
    var me = this


/*
    var myNewList = Ext.create('Ext.ux.form.MultiSelect', {
      msgTarget: 'under',
      border: false,
      anchor: '100%, 60%',

//      fieldLabel: 'Multiselect',
      name: 'multiselect',
      id: 'info-multiselect',
      allowBlank: false,

      store: [
        [123, 'One Hundred Twenty Three'],
        ['1', 'One'],
        ['2', 'Two'],
        ['3', 'Three'],
        ['4', 'Four'],
        ['5', 'Five'],
        ['6', 'Six'],
        ['7', 'Seven'],
        ['8', 'Eight'],
        ['9', 'Nine']
      ],
      value: ['3', '4', '6'],

      ddReorder: true
    })

    this.items = [
      myNewList
    ]
*/
    this.callParent (arguments)
  },


  loadStore: function (accessions) {

  }

})