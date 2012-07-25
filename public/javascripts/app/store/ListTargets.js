/**
 * This store keeps the objects which are displayed in the list of selected targets
 * So, the data here will be being inserted and removed as the user removes and/or
 * adds objects to it.
 */
Ext.define('TDGUI.store.ListTargets', {
  requires:'TDGUI.model.ListTarget',
  extend:'Ext.data.Store',
  model:'TDGUI.model.ListTarget',

  id:'listTargetsStore',
  storeId:'listTargetsStore',
  data:[],

  myMask:undefined,

  proxy:{
    type:'memory',
    reader:{
      type:'json'
//			root: 'targets'
    }
  },


  clone:function () {
    var newStore = Ext.create('TDGUI.store.ListTargets')

    var recs = this.data
    recs.each(function (item, index, totalLen) {
      var objData = item.data
      var newObj = {}
      for (var attr in objData)
        newObj[attr] = objData[attr]

      newStore.add(newObj)
    })

    return newStore
  }

})