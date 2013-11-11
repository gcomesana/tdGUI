/**
 * Created with JetBrains RubyMine.
 * User: jameseales
 * Date: 12/07/2012
 * Time: 14:10
 * To change this template use File | Settings | File Templates.
 */
Ext.define('TDGUI.view.grid.PharmByTargetScrollingGrid', {
  extend: 'TDGUI.view.grid.DynamicGrid3',
  alias: 'widget.tdgui-pharmbytargetscroll-grid',

  layout: 'fit',
  // verticalScrollerType:Ext.create('LDA.helper.DynamicPagingToolbar', {itemId:'pager_id'}),
  // verticalScrollerType: 'paginggridscroller',
  loadMask: true,
  disableSelection: true,
  invalidateScrollerOnRefresh: false,

  listeners: {
    'sortchange': function (ct, column, direction, eOpts) {
      console.log('PharmByTargetScrollingGrid: sortchange()');
      this.setLoading(true);
    }
  },

  //  store: 'TargetPharmacologyPaginatedStore',
  exportStore: null,
  /*
  getExportStore: function () {
    if (this.exportStore == null) {
      this.exportStore = Ext.create('LDA.store.TargetPharmacologyPaginatedStore', {});
    }
    return this.exportStore;
  },
  */


  viewConfig: {
    enableTextSelection: true
  },


  initComponent: function () {
    /*
    var myConfig = {
    };
    Ext.apply(this,myConfig);
    Ext.apply(this.initialConfig, myConfig);
    */
    console.log("PharmByTargetScrollingGrid.initComponent!!!");
    this.columns = [{
        xtype: 'rownumberer',
        width: 40
      },
      {
        //TODO: renderer for chemical structure image (from chemspider?)
        header: 'Structure',
        dataIndex: 'cs_compound_uri',
        xtype: 'templatecolumn',
        width: 135,
        tpl: '<img width="128" height="128" src="http://www.chemspider.com/ImagesHandler.ashx?id={csid}&w=128&h=128" alt="CSID:{csid}"/>',
        sortable: false
      },
      {
        header: 'Compound Name',
        dataIndex: 'compound_pref_label',
        width: 180,
        renderer: targetProvenanceRenderer,
        //align:'center',
        tdCls: 'wrap gridDescriptiveRowPadding'

      },
      {
        header: 'Target Name',
        dataIndex: 'target_pref_label',
        width: 180,
        renderer: targetProvenanceRenderer,
        //align:'center',
        tdCls: 'wrap gridDescriptiveRowPadding'
      },
      {
        header: 'Target Organism',
        dataIndex: 'target_organism',
        width: 130,
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'
      },
      {
        header: 'Assay Organism',
        dataIndex: 'assay_organism',
        tooltip: 'Name of the organism for the assay system (e.g., the organism, tissue or cell line in ' +
          'which an assay was performed). May differ from the target organism (e.g., for a human protein' +
          ' expressed in non-human cells, or pathogen-infected human cells)',
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'Assay Description',
        dataIndex: 'assay_description',
        width: 150,
        tdCls: 'wrap gridDescriptiveRowPadding',
        renderer: targetProvenanceRenderer
        //align:'center'
      },
      {
        header: 'Activity Type',
        dataIndex: 'activity_activity_type',
        width: 72,
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'Relation',
        dataIndex: 'activity_relation',
        width: 52,
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'Value',
        dataIndex: 'activity_standard_value',
        width: 60,
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'
      },
      {
        header: 'Units',
        dataIndex: 'activity_standard_units',
        width: 60,
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'Mol Weight',
        dataIndex: 'compound_full_mwt',
        width: 80,
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'SMILES',
        dataIndex: 'compound_smiles',
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'InChi',
        dataIndex: 'compound_inchi',
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      },
      {
        header: 'InChi Key',
        dataIndex: 'compound_inchikey',
        renderer: targetProvenanceRenderer,
        align: 'center',
        tdCls: 'gridRowPadding'

      }
    ];


    this.callParent(arguments);
  },

  target_prov: false,
  toggleProv: function (val) {
    this.target_prov = val;
    console.log(" Show target provenance : " + this.target_prov);
    this.doLayout();
  }

}); // EO component definition


function targetProvenanceRenderer(data, cell, record, rowIndex, columnIndex, store) {
//  console.log("Target Pharmacology provenance renderer");

  //if (LDAProvenanceMode != LDA.helper.LDAConstants.LDA_PROVENANCE_OFF) {
  if (this.target_prov) {
    console.log("cell rendered using targetProvenanceRenderer...");

    var recdata = this.columns[columnIndex].dataIndex;
    var itemdata = recdata + '_item';
    recdata += '_src';

    var source = record.data[recdata];
    var cls = LDA.helper.LDAConstants.LDA_SRC_CLS_MAPPINGS[source];

    if (!cls) {
      cls = 'defaultValue';
    }
    var iconCls = cls + 'Icon';
    iconCls = '/assets/' + iconCls + '.png';
    //console.log(iconCls);
    cls += LDAProvenanceMode;
    if (LDAProvenanceMode == LDA.helper.LDAConstants.LDA_PROVENANCE_COLOUR) {
      if (record.data[recdata] && data) {
        // return '<div class="' + cls + '">' + data + '</div>' + '<br>' + record.data[recdata];
        return '<div class="' + cls + '">' + data + '</div>' + '<br>' + '<a href="' + record.data[itemdata] + '" target="_blank">' + '<img src="' + iconCls + '" height="15" width="15"/>' + '</a>';
      }
      else
        return '<div class="' + cls + '">' + data + '</div>'
    }

    //else if (LDAProvenanceMode == LDA.helper.LDAConstants.LDA_PROVENANCE_ICON) {
    //this needs an img adding in
    //    return '<div class="' + cls + '">' + data + '</div>';
    //} else if (LDAProvenanceMode == LDA.helper.LDAConstants.LDA_PROVENANCE_TEXT) {
    //    return '<div class="' + cls + '">' + data + ' (' + source + ')</div>';
    //}
  }
  else {
    return data;
  }

  return data;
}


//{
//    header:'Chemspider ID',
//    dataIndex:'cs_compound_uri',
//	sortable:false,
//    renderer:targetProvenanceRenderer,
//    align: 'center'
//},