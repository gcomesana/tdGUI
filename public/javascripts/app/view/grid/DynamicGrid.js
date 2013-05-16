
Ext.Loader.setConfig({enabled:true});
// Ext.Loader.setPath('Ext.ux.grid', 'javascripts/extjs4.0.7/examples/ux/grid');
Ext.Loader.setPath('Ext.ux.grid', 'javascripts/extjs4.1/examples/ux/grid');


/**
 * DynamicGrid
 * Grid which supports any number of columns, depending on the store. An example
 * of use and configuration can be:
 * var grid = form.query('dynamicgrid2')[0];
   grid.store.proxy.extraParams = values;
   grid.store.proxy.api.read = 'core_api_calls/wiki_pathways_by_protein.json';
   grid.store.load();
   grid.store.on('load', function () {
       form.doLayout();
       button.enable();
   });

 * It is supossed the grid was created in advance.
 *
 */
Ext.define('TDGUI.view.grid.DynamicGrid', {
  extend:'Ext.grid.Panel',
  alias:'widget.dynamicgrid2',

  requires:[
    'Ext.grid.RowNumberer',
    'Ext.form.*',
    'Ext.ux.grid.FiltersFeature'
  ],

  //forceFit: true,
  autoScroll:true,
  layout:'fit',
  gridBaseTitle:'',
  limit:100,


  initComponent: function () {

    var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
      groupHeaderTpl:'Group: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
    });


    var filters = {
      ftype:'filters',
      // encode and local configuration options defined previously for easier reuse
      encode:true, // json encode the filter query
      local:true   // defaults to false (remote filtering)
    };


    var config = {
      /*
      tbar:[
        {
          xtype:'exporterbutton',
          name:'exporter-button',
          text:'Download to Excel'
        }
      ],
      */
// Default (empty) store
      store: {
        fields:[],
        proxy:{
          type:'ajax',
          api:{
            read:''
          },
          reader:{
            type:'json',
            root:'objects',
            totalProperty:'totalCount'
          }
        }
      },

      columns: [
        {name:'temp', hidden:true}
      ],

      rowNumberer:true,
      defaultWidth:200,
      features: [groupingFeature, filters]
    };

    Ext.apply(this, config);
    Ext.apply(this.initialConfig, config);
    this.callParent(arguments);
  },



/*
  setAndFillGrid: function () {
    console.info ('DynamicGrid view setAndFillGrid')
    if (typeof(this.store.proxy.reader.jsonData.columns) === 'object') {
      var columns = [];
      if (this.rowNumberer) {
        columns.push(Ext.create('Ext.grid.RowNumberer', {width:40}));
      }

      Ext.each(this.store.proxy.reader.jsonData.columns, function (column) {
        columns.push(column);
      });

      if (typeof(title) == "undefined") {
        var title = this.title;
      }

      if (this.store.proxy.reader.jsonData.totalCount > 0) {
        this.setTitle(this.gridBaseTitle + ' - Records found: ' + this.store.proxy.reader.jsonData.totalCount);
      }
      else {
        this.setTitle(this.gridBaseTitle + ' - Records found: ' + 'No records found!');
      }

      this.reconfigure(this.store, columns);
      this.setHeight('80%');
    }

    this.fireEvent ('endLoading', this)
  },
*/


  onRender: function (ct, position) {
    TDGUI.view.grid.DynamicGrid.superclass.onRender.call(this, ct, position);
//    LSP.view.dynamicgrid.Grid.superclass.onRender.call(this, ct, position);
//    if (this.store.isLoading() == false)
    this.store.proxy.api.read = 'resources/datatest/uniprotxml-single.json';
    this.store.on('load', this.setAndFillGrid, this);
    this.fireEvent ('startLoading', this)
    this.store.load()

 /*
    this.store.load ({
      scope: this,
      callback: function (recs, op, success) {
        var fieldValue;
        var me = this
        this.store.each(function (record) {
          record.fields.each(function (field) {
            fieldValue = record.get(field.name);

            if (Ext.isArray(fieldValue))
              console.info('Array: ' + field.name + ' => ' + fieldValue)
            else
              console.info(field.name + ' => ' + fieldValue)
          });
        });
      }
    })

 */

    /*this.store.proxy.api.read = 'users.json';
     this.store.load();*/
  }


//     ,
//     storeLoad: function() {
//         if(typeof(this.store.proxy.reader.jsonData.columns) === 'object') {
//             var columns = [];
//             if(this.rowNumberer) { columns.push(Ext.create('Ext.grid.RowNumberer',{width:40})); }
//             Ext.each(this.store.proxy.reader.jsonData.columns, function(column){
//                 columns.push(column);
//             });
//             if (typeof(title) == "undefined") {
//      	        var title = this.title;
//             }
//             if (this.store.proxy.reader.jsonData.totalCount > 0){
//                     this.setTitle(title + ' - Records found: ' +  this.store.proxy.reader.jsonData.totalCount);
//             }
//             else {
//                      this.setTitle(title + ' - Records found: ' +  'No records found!');
//             }
//                          this.reconfigure(this.store, columns);
//
//                     }
//     },
//     onRender: function(ct, position) {
//         LSP.view.dynamicgrid.Grid.superclass.onRender.call(this, ct, position);
//         this.store.on('load', this.storeLoad, this);
// 	    /*this.store.proxy.api.read = 'users.json';
//         this.store.load();*/
//     }
});
