Ext.define('TDGUI.controller.grid.DynamicGrid', {
  extend:'Ext.app.Controller',

  views:[
    'grid.DynamicGrid'
  ],

  models:['DynamicGrid'],

  refs:[{
      ref: 'pharmaGrid',
      selector: 'tdgui-pharmbytargetscroll-grid'
    },{
      ref:'gridView',
      selector:'dynamicgrid3'
    }, {
      ref: 'multitargetGrid',
      selector: 'tdgui-multitargetpanel dynamicgrid3'
    }, {
      ref: 'itemList', // accessions textarea
      selector: 'panel > tdgui-item-multilist'
   }],


  myMask: undefined,


  init: function () {
    this.myMask = 'cagallon'
    console.log ("DynamicGrid3.Controller.init... myMask: "+this.myMask)
    this.control ({

      'tdgui-pharmbytargetpanel tdgui-pharmbytargetscroll-grid': {
        afterrender: function (comp, opts) {
          comp.columns[0].setHeight(25);
          this.prepPharmaGrid(comp, opts);
        },
        beforerender: function (comp, opts) {
          comp.columns[0].setHeight(25);
        }
      },

      'dynamicgrid3': {
        afterrender: function (comp, opts) {
          this.initGrid(comp, opts);
        }
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
*
        itemcontextmenu: function (view, record, itemHTMLElement, index, eventObject, eOpts) {
          eventObject.preventDefault();
//                    console.log('itemcontextmenu');
          this.getGridView().showMenu(eventObject.getX(), eventObject.getY(), record);
        }
 */
      }, // EO dynamicgrid3

      'genecir-simple-grid toolbar #sdfDownloadProxy_id': {
        click:this.prepSDFile
      }

    })
  },


  onLaunch:function () {
    console.log ("DynamicGrid3.Controller.onLaunch")
    this.myMask = new Ext.LoadMask(Ext.getBody(), {
      msg:'Loading data...'
    })
  },


  testThis:function (args) {
  },


  addNextRecords:function (this_gridview, extraParams) {
    this_gridview.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
    this_gridview.down('#sdfDownload_id').disable();

    var this_store = this_gridview.store;
    this.myMask.bindStore(this_store)

    var this_controller = this;
//    var temp_store = Ext.create('LSP.store.DynamicGrid');
    var temp_store = Ext.create('TDGUI.store.DynamicGrid');
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
   * Initializes the pharmacology grid component.
   * TODO [This should be changed in order to support deep linking (not depending on comp)]
   * @param {Object} comp the grid component which triggered the event
   * @param {Object} opts passed options
   */
  prepPharmaGrid: function (comp, opts) {
    console.info("Prepping pharmaGrid!!");
    var grid_view = this.getPharmaGrid();
    var grid_store = grid_view.getStore();

// it is suppossed gridParams has the configuration parameters needed
    comp.store.proxy.extraParams = comp.queryParams;
    comp.store.on('load', this.pharmaStoreLoadComplete, comp);
    comp.store.load();
  },



  /**
   * Sets the grid data, callback function for pharma store loading
   * providde by the store associated to the pharma grid.
   * NOTE!!!! The scope is the grid instance (PharByTargetScrollingGrid)
   *
   * @param {Ext.data.Store} store a reference to the grid component store
   * @param {Array} recs
   * @param {boolean} success true if request to backend was successful; false otherwise
   */
  pharmaStoreLoadComplete: function (store, recs, success) {
    console.log("pharma store completed...");
    var grid_view = this;
    var grid_store = grid_view.getStore();
    if (success) {
      // If some records are coming back then set the tsv download params
//      this.setTSVDownloadParams();
      //grid_view.down('#sdfDownload_id').disable();
      //grid_view.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
//      grid_view.down('#sdfDownloadProxy_id').enable();

//      grid_view.down('#tsvDownloadProxy_id').enable();
//      this.getSubmitButton().enable();
      grid_view.reconfigure();
      grid_view.setLoading(false);
      grid_view.setTitle(grid_view.gridBaseTitle + ' - Total Records: ' + grid_store.getCount());
    }
    else {
      console.log(this.$className + ': possible timeout for with uri ' + grid_store.proxy.url);
//      this.getSubmitButton().enable();
      grid_view.setLoading(false);
//      grid_view.setTitle(grid_view.gridBaseTitle + ' ---- There was an error retrieving some of the records ----');
      Ext.MessageBox.show({
          title: 'Info',
          msg: 'We are sorry but the OPS system returned an error.',
          buttons: Ext.MessageBox.OK,
          icon: Ext.MessageBox.INFO
      });
    }
  },



  /**
   * Initialize the grid mostly on regards to the grid's store
   * @param comp
   * @param opts the options to configure the proxy to set up the grid. It should
   * be something like { actionMethods: { read: 'GET' }, api-read: 'urlread', params: {param1:val1, param2: val2}}
   */
  initGrid: function (comp, opts) {
    console.log("DynamicGrid controller: initGrid for "+comp.getXType());
    if (comp.getXType().match(/dynamicgrid3/) == null)
      return;

    var me = this;
    var compActionMethods = comp.storeActionMethods;
    var theActionMethods =
      (compActionMethods === undefined || compActionMethods == null)? {read: "GET"}: compActionMethods

    me.myMask.bindStore(comp.store);
    var defOpts = {
      actionMethods: theActionMethods,
      apiread: comp.readUrl,
      params: {
        offset:0,
        limit:50
      }
    }

// mix the props in the case opts does not have all properties
    for (props in opts)
      for (attrs in defOpts)
        if (props == attrs) defOpts[attrs] = opts[props];

    opts = defOpts;

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
    comp.store.proxy.extraParams = comp.queryParams;
//    comp.store.proxy.extraParams = {entries: 'Q13362,P12345,P0AEN3,P0AEN2,P0AEN1'}

    comp.store.load()
  },



  /**
   * Sets the grid features, like columns and filters, and fill it with the data
   * proviede by the store associated to the grid.
   * NOTE!!!! The scope is the grid instance (dynamicgrid3)
   *
   * @param this_gridview, a reference to the grid component (could be just this)
   * @param success, true if request to backend was successful; false otherwise
   * @return {Boolean}
   */
  setAndFillGrid: function (store, records, success) { // scope: grid instance

    var this_gridview = this;
    var listitems = this_gridview.up('viewport').down('tdgui-item-multilist')
    var numListItems = listitems.getStore().count()
    var numGridItems = store.count()

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

// Check for results correctness for multiple target retrieval (comparing with list of targets)
    if (numGridItems < numListItems &&
        this.up().getXType('panel').match(/multiple/) != null) {
      Ext.MessageBox.show({
        title:'Error',
        msg:'Data for all required targets could not be found: Missing data',
        buttons:Ext.MessageBox.OK,
        icon:Ext.MessageBox.WARNING
      });
      this_gridview.setTitle(this_gridview.gridBaseTitle + ' - Missing data!');
    }


//    this_gridview.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
//    mask.show()
    var dynamicgridStore = this_gridview.store;
    if (typeof (dynamicgridStore.proxy.reader.jsonData.columns) === 'object') {
      var columns = [];

      if (this_gridview.rowNumberer)
        columns.push(Ext.create ('Ext.grid.RowNumberer', {width:25}));

// Add columns to grid columns array as they come from json response
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
//    mask.hide()
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