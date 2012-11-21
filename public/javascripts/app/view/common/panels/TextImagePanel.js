/**
 * @class TDGUI.view.common.panels.TextImagePanel
 * @extends Ext.panel.Panel
 * @alias widget.tdgui-textimagepanel
 *
 * A panel splited in text side and image side (if image is defined...) by
 * using a hbox layout.
 * Specifically built to be used as information display when a graph node is clicked.
 * In such a case, the component in used as content area for a window component
 */
Ext.define('TDGUI.view.common.panels.TextImagePanel', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-textimagepanel',
  requires: ['TDGUI.store.Targets'],

  layout:{
    type:'hbox',
    align:'strech'
  },

  /**
   * @cfg {String} the default image for the template used by this class
   */
  imagePath:'images/target_placeholder.png',
  /**
   * @cfg {Ext.XTemplate} tpl the template used to render the content in this panel
   */
  tpl: undefined,
  /**
   * @cfg {Object} data the data necessary in order this component to work
   */
  data: undefined,
  /**
   * @cfg {Ext.data.Store} the store where the information about targets and
   * adjacencies is going to be retrieved from
   */
  targetStore: undefined,


//  height:150,
  bodyPadding:'2 2 2 2',



//  myMask: undefined,
  //	autoScroll: true,
  //	margin: '2 2 2 2',

  initComponent:function () {
    var me = this
// console.info("TextImagePanel data? " + me.data.nodename)
    var displayWidth = this.width - 15

    this.items = [{
        xtype:'image',
        src: me.imagePath,
        flex: 1,
        width: 150,
        height: 150
      },  {
        xtype: 'panel',
        border: false,
        tpl: me.tpl,
        data: me.data,
        height:'97%',
        autoScroll:true,
        flex:2
      }
    ]

// OJO!!
    this.tpl = undefined
//    this.data = undefined

// Store initialization. Controller will do the store load
//    this.targetStore = Ext.create ("TDGUI.store.Targets")
//    this.targetStore.addListener('load', this.showData, this)

//    this.myMask = new Ext.LoadMask(me.getEl(), {msg:"Please wait..."});
    this.callParent(arguments)
  },


/**
 * Custom callback method to run when the store associated to this TextImagePanel
 * is loaded. Its goal is just to display the right information.
 * @param {Ext.data.Store} store the store source of the data for this class
 * @param {Array} records the records hold in the store
 * @param {boolean} succesful if the operation was succesful (true)
 */
  showData:function (store, records, succesful) {
    console.info("on TextImagePanel.showData")
    var me = this


    if (succesful) {
      if (records.length > 0) {
        var numConn = this.data.numconnections
        var targetRec = store.first()
        var targetData = targetRec.data

        var pdbIdIndex = targetData['pdbIdPage'].indexOf('=') + 1
        var pdbId = targetData['pdbIdPage'].substring(pdbIdIndex)
        var data = {
          nodename: targetData['target_name'],
          nodedesc: targetData['specificFunction'],
          numconnections: numConn,
          pdbId: pdbId
        }


        this.imagePath = 'http://www.rcsb.org/pdb/images/' + pdbId + '_asr_r_250.jpg'
        this.data = data
        var displayField = me.down('panel')
        var imgField = me.down('image')
        imgField.setSrc (this.imagePath)
        displayField.tpl.overwrite (displayField.body, this.data)
      }
    }
//    me.myMask.hide()
  },



  afterStoreLoaded: function (store, records, succesful) {
    if (!succesful)
      return;

    console.log('afterStoreLoaded: Suppossedly store loaded...')
    console.log('record count: '+store.count())
    if (records.length > 0) {
      var genericModel = store.proxy.getModel();
// If you don't use 'prototype' you can't access the fields and many more
// properties of model, even if they are listed as properties :-S
//      var legacyFields = genericModel.prototype.fields.getRange();
      var fields = [];
      var rec = records[0].data
      for (prop in rec) {
        fields.push(Ext.create('Ext.data.Field', {
          name: prop
        }));
      }

      genericModel.prototype.fields.removeAll();
      genericModel.prototype.fields.addAll(fields);

      store.proxy.setModel(genericModel);
    }
    console.log("myComp.id: "+this.getId());

  }

})