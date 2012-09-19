
/**
 * Store to retrieve the proteinInfo data for the targets
 */
Ext.define('TDGUI.store.Targets', {
  requires:'TDGUI.model.Target',
  extend:'Ext.data.Store',
  model:'TDGUI.model.Target',
  id:'Targets',

  proxy:{
    type:'ajax',
    actionMethods:{
      read:'POST'
    },
    extraParams: {
      protein_uri:''
    },
//        extraParams:{protein_uri:'http://www.conceptwiki.org/concept/32f4cb35-a214-475e-8eec-70d3d6a59188'},
    url:'/core_api_calls/protein_info.json',
//        url:'testData.json',
    reader:{
      type:'json',
      root:'objects',
      totalProperty:'totalCount'
    }
  }


});