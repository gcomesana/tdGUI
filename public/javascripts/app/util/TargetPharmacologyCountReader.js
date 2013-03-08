
Ext.define('TDGUI.util.TargetPharmacologyCountReader', {
  extend: 'Ext.data.reader.Json',
  requires: ['TDGUI.util.LDAConstants'],

  readRecords: function(data) {
    var countVal = data['result']['primaryTopic'][TDGUI.util.LDAConstants.LDA_TARGET_PHARMACOLOGY_COUNT];
    var uriVal = data['result']['primaryTopic'][TDGUI.util.LDAConstants.LDA_ABOUT];
    var record = Ext.create ('TDGUI.model.lda.TargetPharmacologyCountModel', {
      count: countVal,
      uri: uriVal
    });

    //        console.log('LDA.model.PharmacologyCountModel: TargetPharmacologyCount');
    //        console.log(JSON.stringify(record));
    return new Ext.data.ResultSet({
      total: 1,
      count: 1,
      records: [record],
      success: true,
      message: 'loaded'
    });
  }
});