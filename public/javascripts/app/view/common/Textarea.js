
Ext.define ("TDGUI.view.common.Textarea", {
  extend: 'Ext.form.field.TextArea',
  alias: 'widget.tdgui-textarea',

  fieldLabel: '',
  disabled: true,

  listeners: {
    afterrender: {
      fn: function (cmp, opts) {
// console.info ("focus on: "+cmp.getXType())
        var el = cmp.getEl()

        el.on ('click', function () {
          cmp.fireEvent ('click', cmp)
        })
      }
    },

    click: {
      fn: function (cmp) {
        if (cmp.disabled)
          cmp.enable(true)
      }
    }
  }
})
