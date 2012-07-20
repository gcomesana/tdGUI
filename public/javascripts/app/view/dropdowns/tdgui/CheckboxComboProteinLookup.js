

/**
 * This is a multixelect combobox with checkboxes for every item.
 * Actually, the items are images (checked and unchecked images) which are
 * switched programmatically.
 * This component has related images and css styles to set up the template
 * to display the combo choices.
 */
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

    itemTpl: Ext.create('Ext.XTemplate',
      '<span style="font-family: verdana; color: grey; ">',
      '<small>Matches: {match}</small></span><br/>',
      '<img id="img{concept_uuid}" src="' + Ext.BLANK_IMAGE_URL + '" class="combo-iconbox-unchecked">',
      '<b>{concept_label}</b>&nbsp;&nbsp;',
//      '<input id="{concept_uuid}" onclick=this.toString() type="checkbox" name="targetItem" value="{concept_uri}" />',
      {
        addListener: function () {
          Ext.select('input[type=checkbox]').on('click', function (event, target) {
            console.log(target);
          }, null, {delegate: 'a'});
        },

        chkOnClick: function () {
          Ext.select('input[type=checkbox]').each (function (el, elemList, index) {
            console.info ("element id: "+el.id)
          })
          console.info ("hasta aquí llego")
        },

        toString: function () {
          console.info ('this is ok')
        }
      }
    ),
/*

    getInnerTpl: function() {
      var me = this // no access
console.info ("this is me: "+me)
      var onclickMsg = "onclick clicked :-S "
      var btn = '<button onclick="console.info(' + onclickMsg + ');">Add</button>'
      var chkbox = '<input id="{concept_uuid}" onclick="console.info('+onclickMsg+': '+ me + ')" type="checkbox" name="targetItem" value="{concept_uri}" />'

      var xtpl = new Ext.XTemplate (
        '<p><span style="font-family: verdana; color: grey; ">',
        '<small>Match: {match}</small></span><br/>',
        '<b>{concept_label}</b>&nbsp;&nbsp;',
        '<input id="{concept_uuid}" type="checkbox" name="targetItem" value="{concept_uri}" />',
        '</p>', {
          chkOnClick: function () {
            Ext.select('input[type=checkbox]').each (function (el, elemList, index) {
              console.info ("element id: "+el.id)
            })
            console.info ("hasta aquí llego")
          }

        }
      )


      var tpl = '<p><span style="font-family: verdana; color: grey; ">' +
        '<small>Match: {match}</small></span><br/>' +
        '<b>{concept_label}</b>&nbsp;&nbsp;' +
         chkbox +
        '</p>';

console.info (xtpl)
      return xtpl
    }
*/
  }, // EO listConfig


  listeners: {
    beforeselect: function (combo, recs, index, opts) {
// console.info ('#'+index+'. '+recs.data.concept_url)
      var urlDef = recs.data.concept_url
      var uniprotAcc
      if (urlDef.indexOf ('uniprot') != -1)
        uniprotAcc = urlDef.substring(urlDef.lastIndexOf('/') + 1)

      var checkBoxId = recs.data.concept_uuid
// Image treatment
      var img = Ext.get('img'+checkBoxId)

//      var checkBox = Ext.get (checkBoxId)
//      checkBox.dom.click()
//      var theEl = new Ext.Element (checkBox)
//      theEl.dom.click()
      var recIndex = this.store.find ('concept_uuid', checkBoxId)
      var recSel = this.store.getAt(recIndex)

// concept_uuid is better solution to further filtering
      if (Ext.Array.contains (this.listSelected, recIndex)) {
        this.listSelected = Ext.Array.remove (this.listSelected, recIndex)
        img.dom.className = 'combo-iconbox-unchecked'
      }
      else {
        this.listSelected.push(recIndex)
        img.dom.className = 'combo-iconbox-checked'
      }

console.info ("*** Currently on the list")
Ext.each (this.listSelected, function (item, index, listIt) {
  console.info (index + ".-" + item)
})
      return false
    },


    select: function (combo, recs, opts) {
      console.info ("selected something...")
    }

  },


/**
 * Gets the selected objects. To do that, the store is accessed using the indexes
 * stored in listSelected, the record.data object is retrieved and appended to the
 * list which will be returned
 * @return {Array} An array with the objects selected.
 */
  getSelectedItems: function () {
    var listChoices = new Array()
    var me = this
    Ext.Array.each (this.listSelected, function (selItem, index, selItems) {
      var rec = me.store.getAt (selItem)
      var objData = rec.data
      listChoices.push(objData)
    })

    return listChoices
  }

})