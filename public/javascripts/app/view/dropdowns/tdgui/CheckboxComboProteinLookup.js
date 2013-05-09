

/**
 * @class TDGUI.view.dropdowns.tdgui.CheckboxComboProteinLookup
 * @extends TDGUI.view.dropdowns.conceptWikiProteinLookup
 * @alias widget.tdgui-chkbox-combo-proteinlookup
 *
 * This is a multiselect combobox with checkboxes for every item.
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

/**
 * @cfg {String} see TDGUI.view.common.ItemMultilist#fieldLabel
 */
  fieldLabel: '',
  width: undefined,
/**
 * @cfg {String} inputString the string if something wants to be initialized
 */
  inputString: '',
/**
 * @cfg {Boolean} [allowBlank=true] if blank entry is allowed, see {@link Ext.form.field.ComboBox}
 */
  allowBlank: true,
/**
 * @cfg {String} emptyText see {@link Ext.form.field.ComboBox#emptyText}
 */
  emptyText: 'Start typing (at least 4 characters)',
//  multiSelect: true,
//  displayField: undefined,
  delimiter: '',

/**
 * @cfg {String} labelAlign label position on to the component
 */
  labelAlign: 'top',
  labelSeparator: '',
/**
 * @cfg {String} labelCls CSS class to apply to the #fieldLabel
 */
  labelCls: 'targetlist-font-label',

  listSelected: [], // keep the index (0 based) of the elements selected in the store

/**
 * @cfg {Object} listConfig the configuration to override the markup rendering in order to add checkbox support.
 * Basically sets a new rendering and behaviour for every item in the combo box.
 */
  listConfig: {
    loadingText: 'Searching...',
    emptyText: 'No matching proteins found.',

    itemTpl: Ext.create('Ext.XTemplate',
      '<span style="font-family: verdana; color: red;">',
      '<small>Matches: {match}</small></span><br/>',
      '<img id="img{uuid}" src="' + Ext.BLANK_IMAGE_URL + '" class="combo-iconbox-unchecked">',
      '<b>{pref_label}</b>&nbsp;&nbsp;',
//      '<input id="{concept_uuid}" onclick=this.toString() type="checkbox" name="targetItem" value="{concept_uri}" />',
      {
        addListener: function () {
          Ext.select('input[type=checkbox]').on('click', function (event, target) {
            console.log('itemTpl XTemplate addListener: '+ target);
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
    )

  }, // EO listConfig


/**
 * @cfg {Object} listeners callback methods to respond to events
 */
  listeners: {
    beforeselect: function (combo, recs, index, opts) {
// console.info ('#'+index+'. '+recs.data.concept_url)
      var urlDef = recs.data.pref_url
      var uniprotAcc
      if (urlDef.indexOf ('uniprot') != -1)
        uniprotAcc = urlDef.substring(urlDef.lastIndexOf('/') + 1)

      var checkBoxId = recs.data.uuid
// Image treatment
      var img = Ext.get('img'+checkBoxId)

//      var checkBox = Ext.get (checkBoxId)
//      checkBox.dom.click()
//      var theEl = new Ext.Element (checkBox)
//      theEl.dom.click()
      var recIndex = this.store.find('uuid', checkBoxId)
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

      return false
    },


    select: function (combo, recs, opts) {
      console.info ("selected something...")
    },


    beforequery: function (qryEv, opts) {
      console.info ('beforequery: qryEv: '+qryEv.query)

      delete qryEv.combo.lastQuery
      while (this.listSelected.length > 0)
        this.listSelected.pop()
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