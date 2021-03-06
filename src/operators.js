
function complex( x, y ) {

  var y = y || 0;
  return { re: x, im: y };

}

var C = complex;

function isComplex( x ) { return isNaN(x) && 're' in x }


function abs( x ) {

  if ( !isComplex(x) ) x = complex(x,0);

  if ( Math.abs(x.re) < Math.abs(x.im) )

    return Math.abs(x.im) * Math.sqrt( 1 + ( x.re / x.im )**2 );

  else

    return Math.abs(x.re) * Math.sqrt( 1 + ( x.im / x.re )**2 );

}

function arg( x ) {

  if ( !isComplex(x) ) x = complex(x,0);

  return Math.atan2( x.im, x.re );

}


// JavaScript does not yet support operator overloading

function add( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    return { re: x.re + y.re, im: x.im + y.im };

  } else return x + y;

}

function sub( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    return { re: x.re - y.re, im: x.im - y.im };

  } else return x - y;

}

function mul( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    return { re: x.re * y.re - x.im * y.im,
             im: x.im * y.re + x.re * y.im };

  } else return x * y;

}

function div( x, y ) {

  // need to handle 0/0...

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    if ( Math.abs(y.re) < Math.abs(y.im) ) {

      var f = y.re / y.im;
      return { re: ( x.re * f + x.im ) / ( y.re * f + y.im ),
               im: ( x.im * f - x.re ) / ( y.re * f + y.im ) };

    } else {

      var f = y.im / y.re;
      return { re: ( x.re + x.im * f ) / ( y.re + y.im * f ),
               im: ( x.im - x.re * f ) / ( y.re + y.im * f ) };

    }

  } else return x / y;

}

function pow( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    if ( x.re === 0 && x.im === 0 && y.re > 0 )
      return complex(0);
    if ( x.re === 0 && x.im === 0 && y.re === 0 && y.im === 0 )
      return complex(1);
    if ( x.re === 0 && x.im === 0 && y.re < 0 )
      throw 'Power singularity';

    var r = Math.sqrt( x.re * x.re + x.im * x.im );
    var phi = Math.atan2( x.im, x.re );

    var R = r**y.re * Math.exp( -phi * y.im );
    var Phi = phi * y.re + y.im * Math.log(r);

    return { re: R * Math.cos(Phi), im: R * Math.sin(Phi) };

  } else if ( x < 0 ) return pow( complex(x), y );

  else return x**y;

}

function root( x, y ) { return pow( x, div( 1, y ) ); }

function sqrt( x ) {

  if ( isComplex(x) ) {

    var R = ( x.re * x.re + x.im * x.im )**(1/4);
    var Phi = Math.atan2( x.im, x.re ) / 2;

    return { re: R * Math.cos(Phi), im: R * Math.sin(Phi) };

  } else if ( x < 0 ) return sqrt( complex(x) );

  else return Math.sqrt(x);

}


