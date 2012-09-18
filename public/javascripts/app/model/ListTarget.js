
/**
 * @class TDGUI.model.ListTarget
 * @extend Ext.data.Model 
 *
 * Model for the selected items displayed in the textarea/list of selected targets.
 */
Ext.define ('TDGUI.model.ListTarget', {
	extend: 'Ext.data.Model',

	fields: [
    'name', // target_name for conceptWiki or /uniprot/protein/recommendedname/fullname
	  'concept_uuid',
    'concept_uri',
    'uniprot_acc', // this is /uniprot/entry/accession, and array
	  'uniprot_id', // this is /uniprot/entry/name
    'uniprot_name',
    { name:'display_field', type: 'string',
      convert: function (value, rec) {
        var accs = rec.data.uniprot_acc
        var accsLabel = accs.length > 0? accs[0]: '-'
        var name = rec.data.name
        var indexOfPar = name.indexOf ('(Homo')
        if (indexOfPar != -1)
          name = name.substring(0, indexOfPar-1)
        return '('+accsLabel+') '+name
      }
    }
	]
})