
Ext.require(['TDGUI.model.ListTarget', 'HT.lib.Util']);

Ext.define('TDGUI.util.Utils', {

  constructor: function () {
    return this;
  },

  /**
   * Converts a json object returned by get_multiple_entries to a list of model
   * which fit with TDGUI.model.ListTarget in order to refresh the list targets
   * @param {Object} opsRecJson the json object
   * @param {String} entries a string which is the parameter entries
   * @return {Array} an array of models
   */
  opsRecs2ListTarget: function (opsRecJson, entries) {
    var recs = opsRecJson.ops_records;
    var paramEntries = entries.split(',');
    var targets = [];

    Ext.each (recs, function (rec, index, theRecs) {
      var uuid;
      var accessions = rec.accessions;

      for (var i=0; i<accessions.length; i++) {
        var res = accessions[i].match(/[A-Z][A-Z0-9]{5}/);
        accessions[i] = res[0];

// as we know entries is like acc;uuid,acc2;uuid2..., the uuid can be got using
// the known accession
        var accIndex = entries.indexOf(res[0]);
        if (accIndex != -1) {
          var uuidIndex = entries.indexOf(';', accIndex);
          uuid = entries.substr(uuidIndex+1, 36);
        }
      }

      var listItem = {
        name: rec.proteinFullName,
        concept_uuid: uuid,
        concept_uri: 'http://www.conceptwiki.org/concept/'+uuid,
        uniprot_acc: accessions,
        uniprot_id: accessions,
        uniprot_name: rec.proteinFullName
      }

      var target = Ext.create('TDGUI.model.ListTarget', listItem);
      targets.push(target);
    }) // EO ops_records Ext.each processing loop

    return targets;
  },


  /**
   *
   * @param jsonResp
   * @param uuid
   * @return {*}
   */
  targetInfo2ListTarget: function (jsonResp, uuid) {
    var accessions = jsonResp.accessions;

    for (var i=0; i<accessions.length; i++) {
    // the accession is embedded in a uniprot url: uniprot.org/uniprot/<accession>
      var res = accessions[i].match(/[A-Z][A-Z0-9]{5}/);
      accessions[i] = res[0];
    }

    var concept_uri = Ext.isDefined(uuid)? 'http://www.conceptwiki.org/concept/'+uuid:
          '';
    var listItem = {
      name: jsonResp.proteinFullName,
      concept_uuid: uuid,
      concept_uri: concept_uri,
      uniprot_acc: accessions,
      uniprot_id: accessions,
      uniprot_name: jsonResp.proteinFullName
    }

    var target = Ext.create('TDGUI.model.ListTarget', listItem);
    return target;
  },


  isAlive: function () {
    return true;
  }

})