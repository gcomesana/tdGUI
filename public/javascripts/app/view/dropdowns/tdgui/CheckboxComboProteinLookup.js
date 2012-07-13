



Ext.define ('TDGUI.view.dropdowns.tdgui.CheckboxComboProteinLookup', {
  extend:'TDGUI.view.dropdowns.conceptWikiProteinLookup',
  alias:'widget.tdgui-chkbox-combo-proteinlookup',

//  requires:[],
// store: declared on conceptWikiProteinLookup
  margin: '0 5 0 0',
  fieldLabel: '',
  width: undefined,
  inputString: '',
  allowBlank: false,
//  multiSelect: true,
//  displayField: undefined,
  delimiter: '',

  listSelected: [], // keep the index (0 based) of the elements selected in the store

  listConfig: {
    loadingText: 'Searching...',
    emptyText: 'No matching proteins found.',
/*
    itemTpl: Ext.create('Ext.XTemplate',
      '<p><span style="font-family: verdana; color: grey; ">',
      '<small>Matches: {match}</small></span><br/>',
      '<b>{concept_label}</b>&nbsp;&nbsp;',
      '<input id="theChkBox" type="checkbox" name="targetItem" value="{concept_uri}" />',
      '</p>', {
        addListener: function () {
          Ext.select('#theChkBox').on('click', function (event, target) {
            console.log(target);
          }, null, {delegate: 'a'});
        }
      }
    ),
*/
    getInnerTpl: function() {
      var me = this // no access
      var onclickMsg = "'onclick clicked :-S'"
      var btn = '<button onclick="console.info(' + onclickMsg + ');">Add</button>'
      var chkbox = '<input id="{concept_uuid}" type="checkbox" name="targetItem" value="{concept_uri}" />'

      var tpl = '<p><span style="font-family: verdana; color: grey; ">' +
        '<small>Match: {match}</small></span><br/>' +
        '<b>{concept_label}</b>&nbsp;&nbsp;' +
         chkbox +
        '</p>';

console.info (tpl)
      return tpl
    }

  }, // EO listConfig


  listeners: {
    beforeselect: function (combo, recs, index, opts) {
// console.info ('#'+index+'. '+recs.data.concept_url)
      var urlDef = recs.data.concept_url
      var uniprotAcc
      if (urlDef.indexOf ('uniprot') != -1)
        uniprotAcc = urlDef.substring(urlDef.lastIndexOf('/')+1)

      var checkBoxId = recs.data.concept_uuid
      var recIndex = this.store.find ('concept_uuid', checkBoxId)
      var recSel = this.store.getAt(recIndex)
// console.info ("lookup beforeselect uuid compariso: "+checkBoxId + ' vs '+
//              recSel.data.concept_uuid)


// concept_uuid is better solution to further filtering
      if (Ext.Array.contains (this.listSelected, checkBoxId))
        this.listSelected = Ext.Array.remove (this.listSelected, checkBoxId)
      else
        this.listSelected.push(checkBoxId)
// Ext.Array.sort (this.listSelected) if strictly necessary

/*
      var textareaQry = 'viewport > panel > panel > panel > textarea'
      var txtArea = combo.up('panel').up('panel').up('panel').down('tdgui-textarea')

      txtArea.addLine(uniprotAcc)
    }
*/
      return false
    },


    select: function (combo, recs, opts) {
      console.info ("selected something...")
    }

  },




  getSelectedItems: function () {
    return this.listSelected
  }

})