

Ext.define('TDGUI.model.Target', {
  extend:'Ext.data.Model',
  fields:['target_name', 'target_type', 'description', 'keywords', 'organism',
    'synonyms', 'cellularLocation', 'molecularWeight', 'numberOfResidues',
    'specificFunction', 'pdbIdPage', 'theoreticalPi'
  ]
});