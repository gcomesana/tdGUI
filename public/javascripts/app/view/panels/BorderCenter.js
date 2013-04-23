
/**
 * @class TDGUI.view.panels.BorderCenter
 * @extends Ext.tab.Panel
 * @alias widget.tdgui-border-center
 *
 * The tab-panel supporting the content area of the viewport
 */
Ext.define ('TDGUI.view.panels.BorderCenter', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.tdgui-border-center',
  requires: ['TDGUI.view.panels.WelcomePanel', 'HT.view.panels.MainCenter'],

  /**
   * @cfg {String} [region=center] the position inside the border layout
   */
	region: 'center',
  layout: 'border',
  /**
   * @cfg {Boolean} border see TDGUI.view.Viewport#border
   */
  border: false,

  /**
   * @cfg {String} [padding='10 0 0 0'] the padding values applied to the HTML element
   * supporting this component
   */
  padding: '10 0 0 0',



  listeners: {
   afterrender: {
     fn: function (comp, opts) {
       opts.extraParams = {
         entries: 'Q13362,P0AEN2,P0AEN3'
       }
//       this.initGrid(comp, opts)
     }
   }
  },


  initComponent: function () {
  	var me = this
console.info ("Initializing panels.BorderCenter comp..." + this.nombre)

    me.items = [{
      xtype: 'tdgui-welcomepanel'
    }, {
      xtype: 'cytopanel',
      title: 'Hypothesis tester'
    }]
/*
	  me.items = [{
      xtype: 'panel',
      region: 'center',
      frame: false,
//      html: 'center center (center up)',
//      title: 'Center',
      minHeight: 80,

// This layout is ultimately needed to get scroolbars on the gridpanel...
// achieved it by the flex property
      layout: {
        type:'vbox',
        align:'stretch'
      },
*
      items: [cw = Ext.create ('Ext.Window', { // TODO delete when disturbing
          xtype: 'window',
          closable: false,
          minimizable: true,
          title: 'Constrained Window',
          height: 200,
          width: 400,
          constrain: true,
          html: 'I am in a Container',
          itemId: 'center-window',
          minimize: function() {
            this.floatParent.down('button#toggleCw').toggle();
          }
        }) // EO create window
      ], // invisible items (a hidden window) for the center center panel
*

      items: [
//        this.theGrid = this.createGrid()
      ],

* DOCKED ITEMS!!!!!!
      dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
          'Text followed by a spacer', ' ', {
            itemId: 'toggleCw',
            text: 'Constrained Window',
            enableToggle: true,
            toggleHandler: function() {
              cw.setVisible(!cw.isVisible());
            }
          }
        ] // EO items
      }] // EO dockedItems
*

    } /* ,
    { // minipanel south /////////////////////////////
      region: 'south',
      height: 100,
      split: true,
      collapsible: true,
      title: 'Splitter above me',
      minHeight: 60,
      html: 'center south (center down)'
    } *
  	]
*/
 		me.callParent (arguments)
	}, // EO initComponent



  /**
   * Creates a grid ({@link TDGUI.view.grid.DynamicGrid3}), in this case to
   * display multiple entries.
   * @return {Object} the created grid
   */
  createGrid: function () {
    var theGrid = Ext.widget ('dynamicgrid3', {
      title: 'Testis DynamicGrid',
      gridBaseTitle: 'gridBaseTitle????',
      margin: '5 5 5 5',
//      border: '1 1 1 1',
      flex: 1,
//      readUrl: 'resources/datatest/yaut.json'
//      readUrl: 'tdgui_proxy/multiple_entries_retrieval?entries=Q13362,P0AEN2,P0AEN3'
      readUrl: 'tdgui_proxy/multiple_entries_retrieval'
    })

    return theGrid
  },



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





  storeLoadComplete:function (store, records, success) {
    console.log('PharmByTargetNameForm: storeLoadComplete(): ' + (new Date()).getUTCMilliseconds());
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
  },




/**
 * Initialize the grid
 * @param comp
 * @param opts
 */
  initGrid: function (comp, opts) {

    var me = this
    var grid_view = this.query('dynamicgrid3')[0]
    grid_view.store.proxy.actionMethods = {read:'GET'};
    grid_view.store.proxy.api.read = grid_view.readUrl;
    grid_view.store.proxy.params = {offset:0, limit:100};
    grid_view.store.proxy.extraParams = opts.extraParams,
    grid_view.store.on('load', this.storeLoadComplete, this);

    grid_view.store.load()
  }
})