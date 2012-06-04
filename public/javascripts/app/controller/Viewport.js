

Ext.define ("TDGUI.controller.Viewport", {
  extend: 'Ext.app.Controller',

  views: ['Viewport'],
  stores: [],

  refs: [],




  init: function () {
    var me = this
    Ext.History.init()

    Ext.History.on('change', function (token) {
console.info ('inside the History event handler')
       if (token) {
          me.handleHistoryToken(token);
       }
    }) // , this);

    this.control({
      'tdgui-viewport': {
        historyAdded: this.handleHistoryToken
      },

    })
  },


  onLaunch: function (app) {
  },


  handleHistoryToken: function (token) {
    console.info ('Viewport controller.handleHistoryToken + '+token)


  }

})