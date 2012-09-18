/**
 * @class TDGUI.store.ListTargets
 *
 * This store keeps the objects which are displayed in the list of selected targets
 * So, the data here will be being inserted and removed as the user removes and/or
 * adds objects to it.
 */
Ext.define('TDGUI.store.ListTargets', {
  requires:'TDGUI.model.ListTarget',
  extend:'Ext.data.Store',
  model:'TDGUI.model.ListTarget',

/**
 * @cfg {String} id the id of this stores
 */
  id:'listTargetsStore',
/**
 * @cfg {String} storeId the id which the store can be access by using Ext.data.StoreManager.lookup
 */
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


/**
 * This method performs a deep cloning of this store, creating new instances of this one and the contained data.
 * It is a kind of factory method for new stores created based on this one.
 * 
 * @return {TDGUI.store.ListTargets} the new instance of the store
 */
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