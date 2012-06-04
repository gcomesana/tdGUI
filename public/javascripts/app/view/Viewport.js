



Ext.define('TDGUI.view.Viewport', {
  extend: 'Ext.container.Viewport',
  alias: 'widget.tdgui-viewport',

  requires: ['TDGUI.view.panels.BorderSouth','TDGUI.view.panels.BorderCenter',
              'TDGUI.view.panels.BorderEast',
              'TDGUI.view.panels.west.SearchPanel',
              'TDGUI.view.panels.west.HistoryPanel',
              'TDGUI.view.panels.west.ExamplesPanel'],

  layout: {
    type: 'border',
    padding: 5
  },
  defaults: {
    split: true
  },



  initComponent: function () {
console.info ("Viewport.initComponent starting...")
    var me = this

/**
    Ext.History.init()
    Ext.History.on('change', function (token) {
      this.fireEvent ('historyAdded', token)
    })
*/
/*
/////////////////////////////////////////////////////// PANEL COMPONENTS //////
    var theCenter = {
      region: 'center',
      layout: 'border',
      border: false,
      items: [
        {
          region: 'center',
          html: 'center center (center up)',
          title: 'Center',
          minHeight: 80,

          items: [
            cw = Ext.create ('Ext.Window', {
              xtype: 'window',
              closable: false,
              minimizable: true,
              title: 'Constrained Window',
              height: 200,
              width: 400,
              constrain: true,
              html: 'I am in a Container',
              itemId: 'center-window',
              minimize: function() {
                this.floatParent.down('button#toggleCw').toggle();
              }
            })
          ], // invisible items (a hidden window) for the center center panel
          dockedItems: [
            {
              xtype: 'toolbar',
              dock: 'bottom',
              items: [
                'Text followed by a spacer', ' ', {
                  itemId: 'toggleCw',
                  text: 'Constrained Window',
                  enableToggle: true,
                  toggleHandler: function() {
                    cw.setVisible(!cw.isVisible());
                  }
                }
              ] // EO items
            }
          ] // EO dockedItems
        } /* ,
        { // minipanel south /////////////////////////////
          region: 'south',
          height: 100,
          split: true,
          collapsible: true,
          title: 'Splitter above me',
          minHeight: 60,
          html: 'center south (center down)'
        } *
      ]
    }


    var tabsSearch = {
      xtype: 'tabpanel',
      activeTab: 0,
      border: false,
      defaults: {
        border: false
      },
      items: [
        {
          title: 'Search',
          bodyPadding: 10,
          html: 'A simple panel? on tab'
        },
        {
          title: 'Retrieve',
          html : 'Another one'

        }
      ]
    }


    var testPanel = {
      xtype: 'panel',
      border: 0,
      html: 'No-border panel'
    }



    var theWestItems = [
      {
        region: 'north',
        split: 'true',
        minHeight: 200,
        height: 80,
        border: 0,
//    html: 'West - North',
        collapsible: true,
        collapseMode: 'header',
        collapseDirection: 'bottom',
        title: 'Search targets',
        layout: 'fit',
        items: [
//      testPanel
          tabsSearch
        ]
      },
      {
        region: 'center',
        split: 'true',
        minHeight: 60,
        html: 'West - Center',
        collapsible: true,
        collapseMode: undefined,
        collapseDirection: 'bottom',
        title: 'History'
      },
      {
        region: 'south',
        split: true,
        minHeight: 160,
        height: 180,
        collapsible: true,
        html: 'West - South',
        title: 'Examples',
        collapsed: true
      }
    ]


    var theEast = {
      region: 'east',
      collapsible: true,
      floatable: true,
      split: true,
      width: 200,
      minWidth: 120,
      minHeight: 140,
      title: 'East',
      layout: {
        type: 'vbox',
        padding: 5,
        align: 'stretch'
      },
      items: [
        {
          xtype: 'textfield',
          labelWidth: 70,
          fieldLabel: 'Text field'
        },
        {
          xtype: 'component',
          html: 'I am floatable'
        }
      ]
    }
// EO //////////////////////////////////////////////// PANEL COMPONENTS //////
*/
    me.items = [
      {
        region: 'north',
//        collapsible: true,
//        title: 'North',
//        split: true,
        height: 100,
        minHeight: 60,
        split: false
//        border: false
//        html: 'north'
      },
      {
        region: 'west',
        collapsible: true,
        title: 'Mission control',
        split: true,
        width: '20%',
        minWidth: 300,
        minHeight: 140,
//            html: 'west<br>I am floatable',
        layout: 'border',
//        items: [theWestItems]
        items: [{
            region: 'north',
            xtype: 'tdgui-west-search'
          }, {
            region: 'center',
            xtype: 'tdgui-west-history'
          }, {
            region: 'south',
            xtype: 'tdgui-west-examples'
        }]
      },
      { xtype: 'tdgui-border-center'},
//      theCenter,
//      theEast,
//      { xtype: 'tdgui-border-east'},
//      { xtype: 'tdgui-border-south'}
    ]

    this.callParent (arguments)
  }

})
