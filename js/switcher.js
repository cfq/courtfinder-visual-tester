$(function (){
  var delay = 1500;

  var sizes = {
    mobile:  "320px",
    tablet:  "768px",
    desktop: "1024px",
    full:    "100%"
  };

  var baseURLs = {
    local:   "http://courtfinder.dev", 
    dev:     "http://courtfinder.dev", 
    staging: "https://courtfinder.is.dsd.io",
    live:    "https://courttribunalfinder.service.gov.uk"
  };

  var baseUrl = baseURLs['live'];

  var $iframe = $('iframe');
  var paused = false;

  function loadCourt( index ){
    $iframe.attr( 'src', baseUrl + courts[index].url );
  }

  function loadRandomCourt(){
    loadCourt(~~(Math.random() * courts.length));
  }

  function setSize( size ){
    if( !( size in sizes ) ){ return false; }

    $iframe.css( { width: sizes[size] } );
  }

  function scrollThroughSizes( callback ){
    setTimeout( function (){ setSize("mobile")  }, delay * 1);
    setTimeout( function (){ setSize("tablet")  }, delay * 2);
    setTimeout( function (){ setSize("desktop") }, delay * 3);
    setTimeout( function (){ setSize("full")    }, delay * 4);
    setTimeout( callback,                          delay * 5);
  }

  function startShow(){
    setSize("mobile")
    loadRandomCourt();
    scrollThroughSizes( startShow );
  }

  startShow();

  $('body').keydown(function (event){
    if( event.which == 'S'.charCodeAt(0) ){
      paused = paused ? false : true;
    }
  });
});
