Ext.define('TDGUI.store.lda.BaseStore', {
  extend: 'Ext.data.Store',
  requires: ['TDGUI.util.LDAConstants'],

  _format: 'json',
  uri: '',
  BASE_URL: '',

  remoteSort: true,
	stringEncoder: Ext.create('TDGUI.util.QueryStringEncoder'),
  proxy: {
    type: 'ajax',
    noCache: false,
    startParam: undefined,
    limitParam: undefined,
    pageParam: undefined,
    url: this.BASE_URL

  },


  listeners: {
    //this is used to construct the proxy url before the load is done
    beforeprefetch: {
      fn: function () {
        var me = this;
        console.log('Proxy: ' + Ext.ClassManager.getName(this) + ' URL updated to: ' + this.proxy.url);
//        me.updateProxyURL();
      }
    },

    beforeload: {
      fn: function () {
        var me = this;
        console.log('Proxy: ' + Ext.ClassManager.getName(this) + ' URL updated to: ' + this.proxy.url);
//        me.updateProxyURL();
      }
    }
  },


// Allow sorting with less than pageSize of results
// Supposedly fixed according to http://www.sencha.com/forum/showthread.php?190791-4.1-RC1-Remote-sort-from-a-buffered-store-fails-on-small-data-sets
// but the behaviour still persists.
// TODO check EXTJS updates to see if it gets fixed
  prefetchPage: function (page, options) {
    console.log('BaseStore.prefetchPage ('+page+'...)');
    var me = this,
      pageSize = me.pageSize || me.defaultPageSize,
      start = (page - 1) * me.pageSize,
      total = me.totalCount;

    // No more data to prefetch.
    // changed this line by adding check for count greater than page size
    if (total !== undefined && me.getCount() === total && me.getCount() > pageSize) {
      return;
    }

// Copy options into a new object so as not to mutate passed in objects
// and then, obviously, calls the prefetchPage method
    me.prefetch (Ext.applyIf({
      page: page,
      start: start,
      limit: pageSize
    }, options));
  },


  updateProxyURL: function () {
    this.proxy.url = this.BASE_URL + this.stringEncoder.toQueryString({
      _format: this._format,
      uri: this.uri
    });
    //        console.log('Proxy: ' + Ext.ClassManager.getName(this) + ' URL updated to: ' + this.proxy.url);
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

});

