/**
 * @class TDGUI.view.panels.MultiTarget
 * @extends Ext.panel.Panel,
 * @alias widget.tdgui-multitargetpanel
 *
 * A panel containing a {@link TDGUI.view.grid.DynamicGrid3 grid} and methods to
 * support a mutiple target joint view
 */
Ext.define('TDGUI.view.panels.MultiTarget', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-multitargetpanel',

  requires:['TDGUI.view.grid.DynamicGrid3'],

  /**
   * @cfg {Object} layout see TDGUI.view.panels.LogosPanel#layout
   */
  layout:{
    type:'vbox',
    align:'stretch'
  },

  /**
   * @cfg {Object} gridParams an object to set/add grid.proxy.extraParams
   */
  gridParams:null,
  /**
   * @cfg {Boolean} border see TDGUI.view.Viewport#border
   */
  border: false,

/**
 * @cfg {Object} storeListTargets a copy of the list targets store in order to get the concept_uuid
 * and the concept_uri for coreAPI
 */
  storeListTargets: null,


  initComponent:function () {
    var me = this

    this.theGrid = this.createGrid()
    this.items = [this.theGrid]
    this.callParent(arguments)
  },



  /**
   * Creates an instance of dynamicgrid3 grid component an returns it.
   * @return {TDGUI.view.grid.DynamicGrid3} an instance of thrid
   */
  createGrid:function (config) {
    config = config || {
      title:'Multiple target results',
      gridBaseTitle:'Group targets features',
      margin:'5 5 5 5',
//      border: '1 1 1 1',
      flex:1, // needed to fit all container
//      readUrl: 'resources/datatest/yaut.json'
//      readUrl: 'tdgui_proxy/multiple_entries_retrieval?entries=Q13362,P0AEN2,P0AEN3'
      readUrl:'tdgui_proxy/multiple_entries_retrieval',
      queryParams: this.gridParams,
      forceFit: true,
//      id: 'dyngrid'+(new Date()).getMilliseconds(),
//      itemId: 'dyngrid'+(new Date()).getMilliseconds()

      listeners: {
        itemmouseenter: function(view, record, item) {
          Ext.fly(item).set({'data-qtip': '<b>Double click</b> to get extended information about this target'});
        }
      }
    }

    var theGrid = Ext.create('widget.dynamicgrid3', config)

    return theGrid
  },



  /**
   * Returns a reference to the storeListTargets, which is a clone of the store of
   * the list targets. This is here in order to keep conceptWiki attributes which
   * are not present in the grid's store. Not associated with any component (just a
   * handy store)
   * @return {*} a reference to the targets store
   */
  getListTargetsStore:function () {
    return this.storeListTargets
  }




  /*
   * Initialize the grid mostly on regards to the grid's store
   * @param comp
   * @param opts
   *
   initGrid: function (comp, opts) {

   var me = this
   var grid_view = this.query('dynamicgrid3')[0]
   grid_view.store.proxy.actionMethods = {read:'GET'};
   grid_view.store.proxy.api.read = grid_view.readUrl;
   grid_view.store.proxy.params = {offset:0, limit:100};
   grid_view.store.on('load', this.storeLoadComplete, this);

   grid_view.store.load()
   },


   /**
   * Sets the grid features, like columns and filters, and fill it with the data
   * proviede by the store associated to the grid
   * @param this_gridview, a reference to the grid component
   * @param success, true if request to backend was successful; false otherwise
   * @return {Boolean}
   *
   setAndFillGrid: function (this_gridview, success) {
   if (success === false) {
   Ext.MessageBox.show({
   title:'Error',
   msg:'Call to OpenPhacts API timed out.<br/>We are sorry, please try again later.',
   buttons:Ext.MessageBox.OK,
   icon:Ext.MessageBox.ERROR
   });
   this_gridview.setTitle(this_gridview.gridBaseTitle + ' - Error on search!');
   return false;
   }

   //    this_gridview.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');

   var dynamicgridStore = this_gridview.store;
   if (typeof(dynamicgridStore.proxy.reader.jsonData.columns) === 'object') {
   var columns = [];
   if (this_gridview.rowNumberer) {
   columns.push(Ext.create('Ext.grid.RowNumberer', {width:40}));
   }
   Ext.each(dynamicgridStore.proxy.reader.jsonData.columns, function (column) {
   columns.push(column);
   if (column.text == 'csid_uri') {
   this_gridview.csid_column = true;
   this_gridview.down('#sdfDownloadProxy_id').enable();
   }
   });
   this_gridview.reconfigure (dynamicgridStore, columns);
   this_gridview.recordsLoaded = dynamicgridStore.data.length;
   if (this_gridview.recordsLoaded == 0) {
   this_gridview.setTitle(this_gridview.gridBaseTitle + ' - No records found within OPS for this search!');
   Ext.MessageBox.show({
   title:'Info',
   msg:'The OPS system does not contain any data that match this search.',
   buttons:Ext.MessageBox.OK,
   icon:Ext.MessageBox.INFO
   });
   }
   else {
   this_gridview.setTitle(this_gridview.gridBaseTitle + ' - Records loaded: ' + this_gridview.recordsLoaded);
   if (this_gridview.recordsLoaded == this_gridview.limit) {
   this_gridview.down('#nextRecords').enable();
   //                     this_gridview.down('#csvDownloadProxy_id').enable();

   }
   else {
   this_gridview.setTitle(this_gridview.gridBaseTitle + ' - All ' + this_gridview.recordsLoaded + ' records loaded');
   }
   }

   }
   },


   /**
   * This is a callback method on response to the load event on the store of the grid
   * @param store                                                                   x
   * @param records
   * @param success
   *
   storeLoadComplete: function (store, records, success) {
   //    var controller = this.getController('LSP.controller.grids.DynamicGrid');

   //    var grid_view = this.getGridView();
   //    var form = this.getFormView();
   //    var button = this.getSubmitButton();

   var grid_view = this.down("dynamicgrid3")
   this.setAndFillGrid(grid_view, success);
   //    form.doLayout();
   //    button.enable();
   grid_view.doLayout();
   grid_view.doComponentLayout();
   //    form.setLoading(false);
   }
   */


})
