/**
 * onLaunch:function () {
         this.control(
             {
                 'PharmByTargetNameForm':{
                     afterrender:this.prepGrid
                 }
             });
     },
 *
 *
 * prepGrid:function () {
         var grid_controller = this.getController('LSP.controller.grids.DynamicGrid');
         var grid_view = this.getGridView();
         var add_next_button = Ext.ComponentQuery.query('PharmByTargetNameForm dynamicgrid3 #nextRecords')[0];
         add_next_button.on('click', function () {
             var form_values = add_next_button.up('form').getValues();
             grid_controller.addNextRecords(grid_view, form_values);
         });
         grid_view.store.proxy.actionMethods = {read:'POST'};
         grid_view.store.proxy.api.read = grid_view.readUrl;
         //previously multiple 'load' event listeners were being added.
         //one before every store load
         //this was slowing everything down
         var form = this.getFormView();
         var button = this.getSubmitButton();
         grid_view.store.on('load', function (this_store, records, success) {
             grid_controller.storeLoad(grid_view, success);
             form.doLayout();
             button.enable();
             grid_view.doLayout();
             grid_view.doComponentLayout();
         });
         grid_view.store.proxy.params = {offset:0, limit:100};
     },
 */




// Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux.grid', 'javascripts/extjs4.0.7/examples/ux/grid');

/**
 * @class TDGUI.view.grid.DynamicGrid3
 * @extend Ext.grid.Panel
 * @alias widget.dynamicgrid3
 *
 * Specialization of the {@link Ext.grid.Panel ExtJs 4 gridpanel}. This grid
 * is dynamically built upon data response. {@link TDGUI.controller.grid.DynamicGrid}
 * loads the store, set up the columns and fill the grid.
 */
Ext.define('TDGUI.view.grid.DynamicGrid3', {
  extend:'Ext.grid.Panel',
  alias:'widget.dynamicgrid3',

  requires:[
    'Ext.grid.RowNumberer',
    'Ext.form.*',
    'Ext.ux.grid.FiltersFeature',
    'Ext.selection.CellModel',
    'TDGUI.view.grid.feature.selectable'
  ],

  autoScroll:true,
  layout:'fit',
  /**
   * @cfg {String} gridBaseTitle the title for the grid (on top)
   */
  gridBaseTitle:'',

  /**
   * @cfg {String} readUrl It is used as url to pass through the controller an load the store
   */
  readUrl:'', // It is used as url to pass through the controller an load the store
  limit:100,
  recordsLoaded:0,

  csid_column:false,
  contextMenu:null,

  columns:[
    {name:'temp', hidden:true}
  ],



  initComponent: function () {

// initializing features for the grid
    var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
      groupHeaderTpl:'Group: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
    });

    var filters = {
      ftype:'filters',
      encode:true, // json encode the filter query
      local:true   // defaults to false (remote filtering)
    };

    // this feature allows for selection of text in the grid by changing the underlaying style for the cell
    var cellTextSelector = {
      ftype:'selectable',
      id:'selectable'
    };

//    var grid_store = Ext.create('TDGUI.store.DynamicGrid');
    console.log ("DynamicGrid3.initComponent!!!");
    var config = {
/*      store: grid_store,
      columns:[
        {name:'temp', hidden:true}
      ],
*/
      rowNumberer:true,
      defaultWidth:200,
      features: [groupingFeature, filters, cellTextSelector]
    }; // EO config

    Ext.apply(this, config);
    Ext.apply(this.initialConfig, config);
//    config = Ext.apply({}, config);
//    Ext.apply(this, Ext.apply(this.initialConfig, config));
    this.callParent(arguments);
  },


  /**
   * Shows a contextual grid menu based on the data the grid holds
   * @param {Number} x the X coordinate for the menu raising
   * @param {Number} y the Y coordinate for the menu raising
   * @param {Ext.data.Model} the record selected
   */
  showMenu: function (x, y, record) {
    var cmp = record.data.compound_name;
    var tar = record.data.target_name;
    var smi = record.data.smiles;

    if (tar) {
      var cmpValueMenu = new Ext.menu.Menu({
        layout:'fit',
        items:[
          {
            xtype:'textfield',
            value:cmp
          },
          {
            xtype:'textfield',
            value:tar
          },
          {
            xtype:'textfield',
            value:smi
          }
        ]
      });

      var contextMenu = new Ext.menu.Menu({
        items:[
          {
            text:'Search for compound by name',
            itemId:'searchForCompoundByName',
            iconCls:'menu-search-compound',
            handler:function () {
//                        console.log('Search for compound by name');
//                        console.log(cmp);
              Ext.History.add('!p=CmpdByNameForm&s=' + cmp);
            }
          },
          {
            text:'Search for compound by SMILES',
            itemId:'searchForCompoundBySMILES',
            iconCls:'menu-search-compound',
            handler:function () {
//                        console.log('Search for compound by SMILES');
//                        console.log(cmp);
              Ext.History.add('!p=SimSearchForm&sm=' + smi + '&st=exact');
            }
          },
          {
            text:'Search for target by name',
            itemId:'searchForTarget',
            iconCls:'menu-search-target',
            handler:function () {
//                        console.log('Search for target by name');
//                        console.log(tar);
              Ext.History.add('!p=TargetByNameForm&s=' + tar);
            }
          },
          {
            text:'Copy Data',
            menu:cmpValueMenu
          }
        ]
      });
      contextMenu.showAt(x, y);
    }
    else {
      var cmpValueMenu = new Ext.menu.Menu({
        layout:'fit',
        items:[
          {
            xtype:'textfield',
            value:cmp
          },
          {
            xtype:'textfield',
            value:smi
          }
        ]
      });

      var contextMenu = new Ext.menu.Menu({
        items:[
          {
            text:'Search for compound by name',
            itemId:'searchForCompoundByName',
            iconCls:'menu-search-compound',
            handler:function () {
//                        console.log('Search for compound by name');
//                        console.log(cmp);
              Ext.History.add('!p=CmpdByNameForm&s=' + cmp);
            }
          },
          {
            text:'Search for compound by SMILES',
            itemId:'searchForCompoundBySMILES',
            iconCls:'menu-search-compound',
            handler:function () {
//                        console.log('Search for compound by SMILES');
//                        console.log(cmp);
              Ext.History.add('!p=SimSearchForm&sm=' + smi + '&st=exact');
            }
          },
          {
            text:'Copy Data',
            menu:cmpValueMenu
          }
        ]
      });

      contextMenu.showAt(x, y);
    }
  } // EO showMenu


})
;