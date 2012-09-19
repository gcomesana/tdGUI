Ext.define("TDGUI.view.common.Textarea", {
  requires: 'TDGUI.store.ListTargets',
  extend:'Ext.form.field.TextArea',
  alias:'widget.tdgui-textarea',

  fieldLabel:'',

  dataStore: Ext.create('TDGUI.store.ListTargets'),

  listeners:{
    afterrender:{
      fn:function (cmp, opts) {
// console.info ("focus on: "+cmp.getXType())
        var el = cmp.getEl()

        el.on('click', function () {
          cmp.fireEvent('click', cmp)
        })
      }
    },

    click:{
      fn:function (cmp) {
        if (cmp.disabled)
          cmp.enable(true)
      }
    }
  },

  /*
   addLine: function (theValue) {
   var txtValues = this.getRawValue()

   txtValues += theValue+'\n'
   this.setRawValue(txtValues)
   }
   */


  getStore: function () {
    return this.dataStore
  },

  addLine:function (theValue) {
    var txtValues = this.getRawValue()
    this.setRawValue('')
    if (txtValues.charAt(txtValues.length - 1) != '\n' && txtValues.length > 0)
      txtValues += '\n'

    // check for object
    var value2insert
    if (Ext.isObject(theValue) && theValue.get('uniprot_acc') && theValue.get('name')) {
      var acc = theValue.get('uniprot_acc').split(',')[0]
      value2insert = acc + " - " + theValue.get('name')
    }
    else if (Ext.isString(theValue))
      value2insert = theValue


    txtValues += value2insert + '\n'
    this.setRawValue(txtValues)
  },


  listeners:{
    afterrender:function (comp, opts) {
      console.info('afterrender TargetTextarea')
      var me = this
//      me.store = Ext.create('AttributesTargets')

      var labels = [
        'TP53-regulated inhibitor of apoptosis 1',
        'Next to BRCA1 gene 1 protein (Homo sapiens)',
        'Kita-kyushu lung cancer antigen 1 (Homo sapiens)'
      ]
/*
      Ext.Array.each(labels, function (item, number, theLabels) {
        var speciesIndex = item.indexOf('(Homo sapiens)')
        if (speciesIndex != -1)
          item = item.substring(0, speciesIndex - 1)

        Ext.Ajax.request({
          url:'/tdgui_proxy/get_uniprot_by_name.json',
          method:'GET',
          params:{
            label:item
          },

          failure:function (resp, opts) {
            console.info('ajax failed for item number: ' + number)
          },

          success:function (resp, opts) {
            console.info('success for number ' + number)
          }
        })
      })
*/
      /*
       me.store.loadData (myData)
       console.info ('storeCount: '+me.store.count())

       me.store.each (function (record) {
       console.info ('name: '+this.get('name'))
       me.addLine(this)
       })

       me.store.loadData ([oneData], true)
       console.info ('new count: '+me.store.count())
       */
    } // EO afterrender
  }
})
