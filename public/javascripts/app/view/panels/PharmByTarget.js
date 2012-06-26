


Ext.define ('TDGUI.view.panels.PharmByTarget', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-pharmbytargetpanel',

  requires: ['TDGUI.view.grid.DynamicGrid3'],

  layout:{
    type:'vbox',
    align:'stretch'
  },
  gridParams: null, // an object to set/add grid.proxy.extraParams


  initComponent:function () {
    var me = this

    this.theGrid = this.createGrid()
    this.items = [this.theGrid]
    this.callParent(arguments)
  },


  /**
   * Creates an instance of dynamicgrid3 grid component an returns it.
   * @return {grid} an instance of thrid
   */
  createGrid: function (config) {
    config = config || {
      title:'Pharmacology for target '+this.targetName,
      gridBaseTitle:'Pharmacology compounds for '+this.targetName,
      margin:'5 5 5 5',
      //      border: '1 1 1 1',
      flex:1, // needed to fit all container
      //      readUrl: 'resources/datatest/yaut.json'
      //      readUrl: 'tdgui_proxy/multiple_entries_retrieval?entries=Q13362,P0AEN2,P0AEN3'

// further (and dynamic) store configuration
      readUrl:'/core_api_calls/pharm_by_protein_name.json',
      queryParams: this.gridParams,
      storeActionMethods: {
        read: 'POST'
      }
      //      id: 'dyngrid'+(new Date()).getMilliseconds(),
      //      itemId: 'dyngrid'+(new Date()).getMilliseconds()
    }

    var theGrid = Ext.create('widget.dynamicgrid3', config)

    return theGrid
  }

})