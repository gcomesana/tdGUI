


/**
 * @class TDGUI.model.UniprotEntry
 * @extend Ext.data.Model
 *
 * Model to hold the data retrieved from an uniprot xml entry
 */
Ext.define('TDGUI.model.UniprotEntry', {
  extend:'Ext.data.Model',

  fields:['id', 'proteinFullName', 'function', 'references', 'pdbImg']
});


