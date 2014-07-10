var DataQuality = (function (){
    "use strict";

    var DataQuality = {
        courts: [],

        init: function (){
            DataQuality.loadCourtData( DataQuality.generateCourtData );
        },

        loadCourtData: function ( callback ){
            $.ajax('data/courts.json', {
              dataType: "json",
              timeout: 20000,
              success: callback,
              error: function (){
                console.log(arguments);
              }
            });
        },

        generateCourtData: function ( data ){
            var cAll = data.courts;
            _.each(cAll, function ( c ){
                var o = _.clone(c);
                o.counts = {};
                o.phones = 
            });
        }

    }

    return DataQuality;
})();

$(DataQuality.init);
