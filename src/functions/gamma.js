
function factorial( n ) {

  if ( Number.isInteger(n) && n >= 0 ) {

    var result = 1;
    for ( var i = 2 ; i <= n ; i++ ) result *= i;
    return result;

  } else return gamma( n+1 );

}

function binomial( n, m ) {

  return factorial(n) / factorial(n-m) / factorial(m);

}


// log of gamma less likely to overflow than gamma
// Lanczos approximation as evaluated by Paul Godfrey

function logGamma( x ) {

  var c = [ 57.1562356658629235, -59.5979603554754912, 14.1360979747417471,
            -0.491913816097620199, .339946499848118887e-4, .465236289270485756e-4,
            -.983744753048795646e-4, .158088703224912494e-3, -.210264441724104883e-3,
            .217439618115212643e-3, -.164318106536763890e-3, .844182239838527433e-4,
            -.261908384015814087e-4, .368991826595316234e-5 ];

  if ( isComplex(x) ) {

    if ( Number.isInteger(x.re) && x.re <= 0 && x.im === 0 )
      throw 'Gamma function pole';

    // reflection formula with modified Hare correction to imaginary part
    if ( x.re < 0 ) {
      var t = sub( log( div( pi, sin( mul(pi,x) ) ) ), logGamma( sub(1,x) ) );
      var s = x.im < 0 ? -1 : 1;
      var d = x.im === 0 ? 1/4 : 0;
      var k = Math.ceil( x.re/2 - 3/4 + d );
      return add( t, complex( 0, 2*s*k*pi ) );
    }

    var t = add( x, 5.24218750000000000 );
    t = sub( mul( add( x, 0.5 ), log(t)), t );
    var s = 0.999999999999997092;
    for ( var j = 0 ; j < 14 ; j++ ) s = add( s, div( c[j], add( x, j+1 ) ) );
    var u = add( t, log( mul( 2.5066282746310005, div( s, x ) ) ) );

    // adjustment to keep imaginary part on same sheet
    if ( s.re < 0 ) {
      if( x.im < 0 && div(s,x).im < 0 ) u = add( u, complex(0,2*pi) );
      if( x.im > 0 && div(s,x).im > 0 ) u = add( u, complex(0,-2*pi) );
    }

    return u;

  } else {

    if ( Number.isInteger(x) && x <= 0 ) throw 'Gamma function pole'; 

    var t = x + 5.24218750000000000;
    t = ( x + 0.5 ) * log(t) - t;
    var s = 0.999999999999997092;
    for ( var j = 0 ; j < 14 ; j++ ) s += c[j] / (x+j+1);
    return t + log( 2.5066282746310005 * s / x );

  }

}

function gamma( x ) {

  // logGamma complex on negative axis
  if ( !isComplex(x) && x < 0 )
    return exp( logGamma( complex(x) ) ).re;
  else return exp( logGamma(x) );

}

function beta( x, y ) {

  return div( mul( gamma(x), gamma(y) ), gamma( add(x,y) ) ); 

}

