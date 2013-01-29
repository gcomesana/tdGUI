Ext.define('TDGUI.lda.store.BaseStore', {
  extend: 'Ext.data.Store',
  requires: ['TDGUI.util.LDAConstants'],

  _format: 'json',
  uri: '',
  BASE_URL: '',

  remoteSort: true,
//	stringEncoder: Ext.create('LDA.helper.JamesQueryStringEncoder'),
  proxy: {
    type: 'ajax',
    noCache: false,
    startParam: undefined,
    limitParam: undefined,
    pageParam: undefined

  },


  listeners: {
    //this is used to construct the proxy url before the load is done
    beforeprefetch: {

      fn: function () {
        var me = this;
        me.updateProxyURL();
      }
    },
    beforeload: {

      fn: function () {
        var me = this;
        me.updateProxyURL();
      }
    }
  },

  // because prefetchData is stored by index
  // this invalidates all of the prefetchedData
  sort: function () {
    var me = this,
      prefetchData = me.pageMap;

    if (me.buffered) {
      if (me.remoteSort) {
        prefetchData.clear();
        //get the specific store to sort the column
        this.sortColumn(arguments);
        this.currentPage = 1;
        this.guaranteeRange(0, 49);
      }
      else {
        me.callParent(arguments);
      }
    }
    else {
      me.callParent(arguments);
    }
  },


  setURI: function (uri) {
    this.uri = uri;
  }

/*
  updateProxyURL: function () {
    this.proxy.url = this.BASE_URL + this.stringEncoder.toQueryString({
      _format: this._format,
      uri: this.uri
    });
    //        console.log('Proxy: ' + Ext.ClassManager.getName(this) + ' URL updated to: ' + this.proxy.url);
  }
*/
});

