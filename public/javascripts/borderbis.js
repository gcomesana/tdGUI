/*

 This file is part of Ext JS 4

 Copyright (c) 2011 Sencha Inc

 Contact:  http://www.sencha.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

 */
Ext.require(['*']);

var theSouth = {
  region: 'south',
  collapsible: true,
  split: true,
  height: 200,
  minHeight: 120,
  title: 'South',
  layout: {
    type: 'border',
    padding: 5
  },
  items: [
    {
      title: 'South Central',
      region: 'center',
      minWidth: 80,
      html: 'South Central Arena'
    },
    {
      title: 'South Eastern',
      region: 'east',
      flex: 1,
      minWidth: 80,
      html: 'South Eastern',
      split: true,
      collapsible: true
    },
    {
      title: 'South Western',
      region: 'west',
      flex: 1,
      minWidth: 80,
      html: 'South Western<br>I collapse to nothing',
      split: true,
      collapsible: true,
      collapseMode: 'mini'
    }
  ]
}


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
    } */
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
      html : 'Another one',

    }
  ],
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



/////////////////////////////////////////////////////////// VIEWPORT /////////////////////
Ext.onReady(function() {
  var cw;

  Ext.create('Ext.Viewport', {
    layout: {
      type: 'border',
      padding: 5
    },
    defaults: {
      split: true
    },
    items: [
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
        items: theWestItems
      },
      theCenter
//      theEast,
//      theSouth
    ]
  });
});
