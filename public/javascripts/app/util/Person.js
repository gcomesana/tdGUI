Ext.define('TDGUI.util.Person', {
  name: 'Unknown',

  constructor: function (name) {
    if (name) {
      this.name = name;
    }

    return this;
  },

  eat: function (foodType) {
    console.log(this.name + " is eating: " + foodType);

    return this;
  }
});