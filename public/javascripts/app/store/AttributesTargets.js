


/**
 * @alias TDGUI.store.AttributesTargets
 * @extends Ext.data.Store
 * 
 * Store to keep the proteinInfo data for the targets in the target list. Use TDGUI.model.AttributesTarget as the
 * model to store the data
 */
Ext.define('TDGUI.store.AttributesTargets', {
  requires:'TDGUI.model.AttributesTarget',
  extend:'Ext.data.Store',
  model:'TDGUI.model.AttributesTarget',

/**
 * @cfg {String} id the id for the store
 */  
  id: 'Targets',

  proxy:{
    type:'memory',

    extraParams: {
      protein_uri:''
    },
//        extraParams:{protein_uri:'http://www.conceptwiki.org/concept/32f4cb35-a214-475e-8eec-70d3d6a59188'},
//    url:'/core_api_calls/protein_info.json',
    url:'/ops_api_calls/protein_info.json',
    reader:{
      type:'json',
      root:'objects',
      totalProperty:'totalCount'
    }
  }


});