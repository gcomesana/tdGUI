/**
 * A panel splited in text side and image side (if image is defined...) by using a hbox layout.
 * Specifically built to be used as information dispaly when a graph node is clicked.
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

  imagePath:'images/target_placeholder.png',
  tpl:undefined,
  data:undefined,

  height:150,
  bodyPadding:'2 2 2 2',

//  myMask: undefined,
  //	autoScroll: true,
  //	margin: '2 2 2 2',

  initComponent:function () {
    var me = this
console.info("TextImagePanel data? " + me.data.nodename)
    var displayWidth = this.width - 15

    this.items = [
      {
        xtype: 'panel',
        border: false,
        tpl: me.tpl,
        data: me.data,
        height:'97%',
        autoScroll:true,
        flex:2
      },
      {
        xtype:'image',
        src: me.imagePath,
        flex: 1,
        width: 150,
        height: 150
      }
    ]

// OJO!!
    this.tpl = undefined
//    this.data = undefined

// Store initialization. Controller will do the store load
    this.targetStore = Ext.create ("TDGUI.store.Targets")
    this.targetStore.addListener('load', this.showData, this)

//    this.myMask = new Ext.LoadMask(me.getEl(), {msg:"Please wait..."});
    this.callParent(arguments)
  },


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
  }

})