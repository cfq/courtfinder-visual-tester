var Browser = (function (){
  "use strict";

  var sizes = {
    mobile:  "320px",
    tablet:  "768px",
    desktop: "1024px",
    full:    "100%"
  };

  var baseURLs = {
    Local:       "http://courtfinder.dev", 
    Development: "http://courtfinder.dev", 
    Staging:     "https://courtfinder.is.dsd.io",
    Production:  "https://courttribunalfinder.service.gov.uk"
  };

  var courtListURL = {
    local: 'data/courtlist.json',
    live: '/courts.json'
  };

  var cycleDelay = 1500;

  var Browser = {
    courtlist: null,
    $courtSelect: null,
    $envSelect: null,
    $iframe: null,
    cycling: false,

    init: function (){
      Browser.$courtSelect = $('#court-controls select');
      Browser.$envSelect = $('#env-controls select');
      Browser.$iframe = $('section iframe');
      Browser.loadCourtList(Browser.populateCourtSelector);
      Browser.populateEnvSelector();

      Browser.$courtSelect.change(Browser.loadSelectedCourt);
      Browser.$envSelect.change(Browser.loadSelectedCourt);
      Browser.$iframe.load(function (){
        Browser.$iframe.removeClass('loading');
      });

      Browser.setupButtons();
    },

    setupButtons: function (){
      $('.size-control').click(function (){
        var size = $(this).attr('id').replace('-size', '');
        Browser.setFrameSize( size );
      });

      $('#cycle-button').click(function (){
        if( Browser.cycling ){
          Browser.setCycling( false );
        }else{
          Browser.setCycling( true );
          Browser.cycleSizes();          
        }
      });

      $('#size-controls button:not(#cycle-button)').click(function (){
        Browser.setCycling( false );
      });

      $('#prev-court, #next-court').click(function ( e ){
        var $c = Browser.$courtSelect;
        var len = $c.children('option').length;
        var currentIndex = $('#court-controls select option:selected').index();
        // previous or next clicked
        var isPrev = $(e.target).closest('button').attr('id').indexOf('prev');

        var nextIndex = isPrev == 0 ? currentIndex - 1 : currentIndex + 1;
        // next two lines for rolling around the list
        var nextIndex = nextIndex == -1 ? ( len - 1) : nextIndex;
        var nextIndex = nextIndex >= len ? 0 : nextIndex;

        $c.children( 'option:nth-child(' + (nextIndex + 1) + ')' ).prop('selected', true);
        Browser.loadSelectedCourt();
      });

      $('#prev-size, #next-size').click(function ( e ){

      });
    },

    loadCourtList: function ( callback ){
      $.getJSON(courtListURL.local, callback);
    },

    populateCourtSelector: function ( courts ){
      var $s = Browser.$courtSelect;
      for( var i = 0; i < courts.length; i++ ){
        $s.append($('<option>').attr('value', courts[i].url).html(courts[i].name));
      }

      Browser.loadSelectedCourt();
    },

    populateEnvSelector: function (){
      var $e = Browser.$envSelect;
      for( var env in baseURLs ){
        $e.append($('<option>').attr('value', env).html(env));
      }
    },

    loadSelectedCourt: function (){
      var path = Browser.$courtSelect.val();
      var url = baseURLs[Browser.$envSelect.val()] + path;

      Browser.$iframe.attr('src', url).addClass('loading');
    },

    setFrameSize: function ( size ){
      if( size in sizes ){
        Browser.$iframe.removeClass().addClass( size );
        $('.size-control').removeClass('active');
        $('#' + size + '-size').addClass('active');
      }
    },

    getCurrentSize: function (){
      var list = Browser.$iframe.attr('class').split(' ');
      var filtered = _.filter(list, function ( c ){
        return c in sizes;
      });

      return filtered[0];
    },

    setCycling: function ( state ){
      if( state ){
        Browser.cycling = true;
        $('#cycle-button').addClass('cycling');
      } else {
        Browser.cycling = false;
        $('#cycle-button').removeClass('cycling');
      }
    },

    cycleSizes: function (){
      if( Browser.cycling ){
        var s = _.keys(sizes);
        var nextSize = s[(s.indexOf(Browser.getCurrentSize()) + 1) % s.length];
        setTimeout(_.bind( function (){
          if( Browser.cycling ){
            Browser.setFrameSize( nextSize );
            Browser.cycleSizes();            
          }
        }, this), cycleDelay);
      }
    }
  };

  return Browser;
})();

$(Browser.init);