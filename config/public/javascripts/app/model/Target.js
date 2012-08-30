
/**
 * This is the model to keep the data returned by calls to proteinInfo service
 */
Ext.define('TDGUI.model.Target', {
  extend:'Ext.data.Model',
  fields:['target_name', 'target_type', 'description', 'keywords', 'organism',
    'synonyms', 'cellularLocation', 'molecularWeight', 'numberOfResidues',
    'specificFunction', 'pdbIdPage', 'theoreticalPi'
  ]
});