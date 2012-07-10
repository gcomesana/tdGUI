





Ext.define ('TDGUI.view.dropdowns.tdgui.ButtonComboProteinLookup', {
  extend:'TDGUI.view.dropdowns.conceptWikiProteinLookup',
  alias:'widget.tdgui-button-combo-proteinlookup',

//  requires:[],

  margin: '0 5 0 0',
  fieldLabel: '',
  width: undefined,
  inputString: '',
  allowBlank: false,
  multiSelect: true,
  displayField: undefined,
  delimiter: '',

  listConfig: {
    loadingText: 'Searching...',
    emptyText: 'No matching proteins found.',

    getInnerTpl: function() {
      var me = this // no access
      var onclickMsg = "'onclick clicked :-S'"
      var btn = '<button onclick="console.info(' + onclickMsg + ');">Add</button>'

      var tpl = '<p><span style="font-family: verdana; color: grey; ">' +
        '<small>Match: {match}</small></span><br/>' +
        '<b>{concept_label}</b> ' +
        btn+
        '</p>';

console.info (tpl)
      return tpl
    }
  }, // EO listConfig


  listeners: {
    beforeselect: function (combo, recs, index, opts) {
// console.info ('#'+index+'. '+recs.data.concept_url)
      var textareaQry = 'viewport > panel > panel > panel > textarea'
      var txtArea = combo.up('panel').up('panel').up('panel').down('tdgui-textarea')

      var urlDef = recs.data.concept_url
      var uniprotAcc
      if (urlDef.indexOf ('uniprot') != -1)
        uniprotAcc = urlDef.substring(urlDef.lastIndexOf('/')+1)

      txtArea.addLine(uniprotAcc)
      return false
    }


  }

})