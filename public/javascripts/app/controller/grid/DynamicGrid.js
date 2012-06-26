Ext.define('TDGUI.controller.grid.DynamicGrid', {
  extend:'Ext.app.Controller',

  views:[
    'grid.DynamicGrid3'
  ],

  models:['DynamicGrid'],

  refs:[{
      ref:'gridView',
      selector:'dynamicgrid3'
    }, {
      ref: 'multitargetGrid',
      selector: 'tdgui-multitargetpanel dynamicgrid3'
  }],


  init: function () {
    this.control ({
      'dynamicgrid3': {
        afterrender: function (comp, opts) {
          this.initGrid(comp, opts)
        },
/*
        itemdblclick: function (view, record, item, index, e, opts) {
console.info ("item double clicked!!!")
          if (record.data.csid_uri !== undefined) {
            var csid = record.data.csid_uri.match(/http:\/\/rdf.chemspider.com\/(\d+)/)[1];
            if (parseInt(csid) >= 1) {
              Ext.create('CS.view.CompoundWindow').showCompound(csid);
            }
          }
        },
*/
        itemcontextmenu:function (view, record, itemHTMLElement, index, eventObject, eOpts) {
          eventObject.preventDefault();
//                    console.log('itemcontextmenu');
          this.getGridView().showMenu(eventObject.getX(), eventObject.getY(), record);
        }

      }, // EO dynamicgrid3

      'dynamicgrid3 toolbar #sdfDownloadProxy_id':{
        click:this.prepSDFile
      }
    })
  },


  onLaunch:function () {
  },


  testThis:function (args) {
  },


  addNextRecords:function (this_gridview, extraParams) {
    this_gridview.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
    this_gridview.down('#sdfDownload_id').disable();

    var this_store = this_gridview.store;
    var this_controller = this;
    var temp_store = Ext.create('LSP.store.DynamicGrid');
    // configure copy store:
    temp_store.proxy.extraParams = extraParams;
    temp_store.proxy.api.read = this_gridview.readUrl;
    temp_store.proxy.actionMethods = this_store.proxy.actionMethods

    var offset = this_store.data.length + 1;
    // We load the copy store to get the new records
    this_gridview.setLoading(true);
    temp_store.load({params:{ offset:offset, limit:100}});
    temp_store.on('load', function (temp_store, new_records, success) {
      if (success === false) {
        Ext.MessageBox.show({
          title:'Error',
          msg:'Call to OpenPhacts API timed out.<br/>We are sorry, please try again later.',
          buttons:Ext.MessageBox.OK,
          icon:Ext.MessageBox.ERROR
        });
        this_gridview.setTitle(this_gridview.gridBaseTitle + ' - Error on search!');
        this_gridview.setLoading(false);
        return false;
      }

      var idx_start = offset - 1;
      var row_count = 0;
      Ext.each(new_records, function (new_record) {
        new_record.index = idx_start + row_count;
        row_count++;
      });

      this_store.loadRecords(new_records, {addRecords:true});
      this_gridview.setLoading(false);
      this_gridview.recordsLoaded = this_store.data.length;
      if (temp_store.data.length < 100) {
        this_gridview.setTitle(this_gridview.gridBaseTitle + ' - All ' + this_gridview.recordsLoaded + ' records loaded');
        this_gridview.down('#nextRecords').disable();
      }
      else {
        this_gridview.setTitle(this_gridview.gridBaseTitle + ' - Records loaded: ' + this_store.data.length);
      }
    });

  },


  /**
   * Initialize the grid mostly on regards to the grid's store
   * @param comp
   * @param opts the options to configure the proxy to set up the grid. It should
   * be something like { actionMethods: { read: 'GET' }, api-read: 'urlread', params: {param1:val1, param2: val2}}
   */
  initGrid: function (comp, opts) {

    var me = this
    var compActionMethods = comp.storeActionMethods
    var theActionMethods =
      (compActionMethods === undefined || compActionMethods == null)? {read: "GET"}: compActionMethods

    var defOpts = {
      actionMethods: theActionMethods,
      apiread: comp.readUrl,
      params:{
        offset:0,
        limit:50
      }
    }

// mix the props in the case opts does not have all properties
    for (props in opts)
      for (attrs in defOpts)
        if (props == attrs) defOpts[attrs] = opts[props];

    opts = defOpts

//    var grid_view = this.query('dynamicgrid3')[0]
    /*
     this.store.proxy.actionMethods = {read:'GET'};
     this.store.proxy.api.read = grid_view.readUrl;
     this.store.proxy.params = {offset:0, limit:100};
     this.store.on('load', this.storeLoadComplete, this);
     */
// grid store configuration through its proxy
    comp.store.proxy.actionMethods = opts.actionMethods;
    comp.store.proxy.api.read = opts.apiread;
    comp.store.proxy.params = opts.params;
    comp.store.on('load', this.setAndFillGrid, comp);
    comp.store.proxy.extraParams = comp.queryParams
//    comp.store.proxy.extraParams = {entries: 'Q13362,P12345,P0AEN3,P0AEN2,P0AEN1'}

    comp.store.load()
  },


  /**
   * Sets the grid features, like columns and filters, and fill it with the data
   * proviede by the store associated to the grid
   * @param this_gridview, a reference to the grid component (could be just this)
   * @param success, true if request to backend was successful; false otherwise
   * @return {Boolean}
   */
  setAndFillGrid: function (store, records, success) { // scope: grid instance
    var this_gridview = this

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
    if (typeof (dynamicgridStore.proxy.reader.jsonData.columns) === 'object') {
      var columns = [];

      if (this_gridview.rowNumberer)
        columns.push(Ext.create ('Ext.grid.RowNumberer', {width:40}));

      Ext.each(dynamicgridStore.proxy.reader.jsonData.columns, function (column) {
        columns.push(column);
        /*
        if (column.text == 'csid_uri') {
          this_gridview.csid_column = true;
          this_gridview.down('#sdfDownloadProxy_id').enable();
        }
        */
      });

      this_gridview.reconfigure(dynamicgridStore, columns);
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

    } // EO if (typeof(...))
  },


/*
 * This is a callback method on response to the load event on the store of the grid
 * The scope of this method is the component (grid), not the controller!!!
 * @param store
 * @param records
 * @param success
 *
  storeLoadComplete: function (store, records, success) {
//    var controller = this.getController('LSP.controller.grids.DynamicGrid');

//    var controller = this.getController('TDGUI.controller.grid.DynamicGrid')
    var grid_view = this // .getGridView(); // no vale
console.info ('storeLoadComplete grid_view: '+this.getId())
//    var form = this.getFormView();
//    var button = this.getSubmitButton();

//    var grid_view = this.down("dynamicgrid3")
    controller.setAndFillGrid(grid_view, success);
//    form.doLayout();
//    button.enable();
    grid_view.doLayout();
    grid_view.doComponentLayout();
//    form.setLoading(false);
  },
*/

  prepSDFile2:function (sdf_prep_button) {
    var gridview = sdf_prep_button.up('dynamicgrid3');
    var grid_store = gridview.store;
    var items = grid_store.data.items;

    var compoundStore = Ext.create('CS.store.Compound');
    var item_count = items.length;
    var success_count = 0;
    var fail_count = 0;
    sdf_prep_button.setText('SD-file preparing...');
    Ext.each(items, function (item) {
      var csid = item.raw.csid_uri.match(/http:\/\/rdf.chemspider.com\/(\d+)/)[1];
      if (!isNaN(parseInt(csid))) {
        if (item.molfile === undefined || item.molfile.length < 30) {
          compoundStore.load({
            params:{ 'csids[0]':csid },
            callback:function (records, operation, success) {
              if (success) {
                success_count++;
                compound = compoundStore.first().raw.Mol;
                item.molfile = compound;
                sdf_prep_button.setText('SD-File ' + (100 * success_count / item_count).toFixed(0) + '% ready');
                if (success_count === item_count) {
                  sdf_prep_button.setText('SD-File ready! Click ->');
                  gridview.down('#sdfDownload_id').enable();
                }
              }
              else {
                fail_count++;
              }
            }
          }, this);
        }
        else {
          success_count++;
          sdf_prep_button.setText('SD-File ' + (100 * success_count / item_count).toFixed(0) + '% ready');
        }
      }
      else {
        fail_count++
      }

    })

  },


  prepSDFile:function (sdf_prep_button) {
    var gridview = sdf_prep_button.up('dynamicgrid3');
    var grid_store = gridview.store;
    var items = grid_store.data.items;

    //    var compoundStore = Ext.create('CS.store.Compound');
    var item_count = items.length;
    var success_count = 0;
    var fail_count = 0;
    sdf_prep_button.setText('SD-file preparing...');
    csid_hash = {};
    csid_molfile_hash = {};
    Ext.each(items, function (item) {
      var csid = item.raw.csid_uri.match(/http:\/\/rdf.chemspider.com\/(\d+)/)[1];
      if (!isNaN(parseInt(csid))) {
        if (item.molfile !== undefined && item.molfile.length > 30) {
          csid_molfile_hash[csid] = item.molfile;
        }
        if (csid_hash[csid] === undefined) {
          csid_hash[csid] = [item.index];
        }
        else {
          csid_hash[csid].push(item.index);
        }
      }
    });
    for (var csid in csid_hash) {
      var csid_records = csid_hash[csid]; // record indices with this csid
      var has_molfile = (csid_molfile_hash[csid] !== undefined);   // true or false if molfile exists in store allready
      if (has_molfile) {
        var idx_len = csid_records.length;
        for (i = 0; i < idx_len; i++) {
          var row = grid_store.getAt(csid_records[i]);
          if (row.molfile == undefined) {
            row.molfile = csid_molfile_hash[csid];
          }
        }
        this.updateSDFStatus(sdf_prep_button, grid_store);
      }
      else {
        this.getMolfile(csid, csid_records, grid_store, sdf_prep_button);
      }
    }
  },


  updateSDFStatus:function (button, store) {
    var items = store.data.items;
    var item_count = items.length;
    var missing_count = 0;
    var success_count = 0;
    Ext.each(items, function (item) {
      if (item.molfile === undefined) {
        missing_count++;
      }
    });
    success_count = item_count - missing_count;
    button.setText('SD-File ' + (100 * success_count / item_count).toFixed(0) + '% ready');
    if (success_count === item_count) {
      button.setText('SD-File ready! Click ->');
      button.up('grid').down('#sdfDownload_id').enable();
    }
  },


  getMolfile:function (csid, row_idxs, grid_store, sdf_prep_button) {
    var me = this;
    var compoundStore = Ext.create('CS.store.Compound');
    var idx_len = row_idxs.length;
    compoundStore.load({
      params:{ 'csids[0]':csid },
      callback:function (obsrecords, operation, success) {
        if (success) {
          var compound = compoundStore.first().raw.Mol;
          for (i = 0; i < idx_len; i++) {
            var item = grid_store.getAt(row_idxs[i]);
            item.molfile = compound;
          }
          me.updateSDFStatus(sdf_prep_button, grid_store);
        }
        else {
          // CHEMSIDER JSONP TIMES OUT!!! HANDLER..?
        }
      }
    }, this);

  }
//         Ext.each(items, function(item) {
//           var csid = item.raw.csid_uri.match(/http:\/\/rdf.chemspider.com\/(\d+)/)[1];
//           if (!isNaN(parseInt(csid))){
//             if (item.molfile === undefined || item.molfile.length < 30) {
//               compoundStore.load({
//                     params: { 'csids[0]': csid },
//                     callback: function (records, operation, success) {
//                         if(success){
//                             success_count++;
//                             compound = compoundStore.first().raw.Mol;
//                             item.molfile = compound;
//                             sdf_prep_button.setText('SD-File ' + (100*success_count/item_count).toFixed(0) + '% ready');
//                             if (success_count === item_count) {
//                               sdf_prep_button.setText('SD-File ready! Click ->');
//                               gridview.down('#sdfDownload_id').enable();
//                               }
//                         }
//                         else {
//                           fail_count++;
//                         }
//                     }
//                 },this);   
//             }
//           else {
//              success_count++;
//              sdf_prep_button.setText('SD-File ' + (100*success_count/item_count).toFixed(0) + '% ready');
//           }
//          }   
//         else {fail_count++}  
//         
//        })

})
;