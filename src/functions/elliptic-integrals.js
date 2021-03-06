
// Carlson symmetric integrals

function carlsonRC( x, y ) {

  if ( x === y ) return 1 / Math.sqrt(x);

  if ( x < y )
    return Math.acos( Math.sqrt(x/y) ) / Math.sqrt(y-x);
  else
    return Math.acosh( Math.sqrt(x/y) ) / Math.sqrt(x-y);

}

function carlsonRD( x, y, z ) {

  return carlsonRJ( x, y, z, z );

}

function carlsonRF( x, y, z, tolerance=1e-10 ) {

  if ( y === z ) return carlsonRC( x, y );
  if ( x === z ) return carlsonRC( y, x );
  if ( x === y ) return carlsonRC( z, x );

  // adapted from mpmath / elliptic.py

  var xm = x;
  var ym = y;
  var zm = z;

  var A0 = (x + y + z) / 3;
  var Am = A0;
  var Q = Math.pow( 3*tolerance, -1/6 )
          * Math.max( Math.abs(A0-x), Math.abs(A0-y), Math.abs(A0-z) );
  var g = .25;
  var pow4 = 1;
  var m = 0;

  while ( true ) {
    var xs = Math.sqrt(xm);
    var ys = Math.sqrt(ym);
    var zs = Math.sqrt(zm);
    var lm = xs*ys + xs*zs + ys*zs;
    var Am1 = (Am + lm) * g;
    xm = (xm + lm) * g;
    ym = (ym + lm) * g;
    zm = (zm + lm) * g;
    if ( pow4 * Q < Math.abs(Am) ) break;
    Am = Am1;
    m += 1;
    pow4 *= g;
  }

  var t = pow4 / Am;
  var X = (A0-x) * t;
  var Y = (A0-y) * t;
  var Z = -X-Y;
  var E2 = X*Y - Z**2;
  var E3 = X*Y*Z;

  return Math.pow( Am, -.5 )
         * ( 9240 - 924*E2 + 385*E2**2 + 660*E3 - 630*E2*E3 ) / 9240;

}

function carlsonRG( x, y, z ) {

  return 1;

}

function carlsonRJ( x, y, z, p, tolerance=1e-10 ) {

  // adapted from mpmath / elliptic.py

  var xm = x;
  var ym = y;
  var zm = z;
  var pm = p;

  var A0 = Am = (x + y + z + 2*p) / 5;
  var delta = (p-x) * (p-y) * (p-z);
  var Q = Math.pow( .25*tolerance, -1/6 )
          * Math.max( Math.abs(A0-x), Math.abs(A0-y), Math.abs(A0-z), Math.abs(A0-p) );
  var m = 0;
  var g = .25;
  var pow4 = 1;
  var S = 0;

  while ( true ) {
    var sx = Math.sqrt(xm);
    var sy = Math.sqrt(ym);
    var sz = Math.sqrt(zm);
    var sp = Math.sqrt(pm);
    var lm = sx*sy + sx*sz + sy*sz;
    var Am1 = (Am + lm) * g;
    xm = (xm + lm) * g;
    ym = (ym + lm) * g;
    zm = (zm + lm) * g;
    pm = (pm + lm) * g;
    var dm = (sp+sx) * (sp+sy) * (sp+sz);
    var em = delta * Math.pow( 4, -3*m ) / dm**2;
    if ( pow4 * Q < Math.abs(Am) ) break;
    var T = carlsonRC( 1, 1 + em ) * pow4 / dm;
    S += T;
    pow4 *= g;
    m += 1;
    Am = Am1;
  }

  var t = Math.pow( 2, -2*m ) / Am;
  var X = (A0-x) * t;
  var Y = (A0-y) * t;
  var Z = (A0-z) * t;
  var P = (-X-Y-Z) / 2;
  var E2 = X*Y + X*Z + Y*Z - 3*P**2;
  var E3 = X*Y*Z + 2*E2*P + 4*P**3;
  var E4 = ( 2*X*Y*Z + E2*P + 3*P**3 ) * P;
  var E5 = X*Y*Z*P**2;
  P = 24024 - 5148*E2 + 2457*E2**2 + 4004*E3 - 4158*E2*E3 - 3276*E4 + 2772*E5;
  Q = 24024;
  var v1 = g**m * Math.pow( Am, -1.5 ) * P/Q;
  var v2 = 6*S;

  return v1 + v2;

}


// elliptic integrals

function ellipticF( x, m ) {

  if ( arguments.length === 1 ) {
    m = x;
    x = pi / 2;
  }

  var period = 0;
  if ( Math.abs(x) > pi / 2 ) {
    var p = Math.round( x / pi );
    x = x - p * pi;
    period = 2 * p * ellipticK( m );
  }

  return sin(x) * carlsonRF( cos(x)**2, 1 - m * sin(x)**2, 1 ) + period;

}

function ellipticK( m ) {

  return ellipticF( m );

}

function ellipticE( x, m ) {

  if ( arguments.length === 1 ) {
    m = x;
    x = pi / 2;
  }

  var period = 0;
  if ( Math.abs(x) > pi / 2 ) {
    var p = Math.round( x / pi );
    x = x - p * pi;
    period = 2 * p * ellipticE( m );
  }

  return sin(x) * carlsonRF( cos(x)**2, 1 - m * sin(x)**2, 1 )
         - m / 3 * sin(x)**3 * carlsonRD( cos(x)**2, 1 - m * sin(x)**2, 1 )
         + period;

}

function ellipticPi( n, x, m ) {

  if ( Math.abs(n) > 1 ) throw 'Index not supported';

  if ( arguments.length === 2 ) {
    m = x;
    x = pi / 2;
  }

  var period = 0;
  if ( Math.abs(x) > pi / 2 ) {
    var p = Math.round( x / pi );
    x = x - p * pi;
    period = 2 * p * ellipticPi( n, m );
  }

  return sin(x) * carlsonRF( cos(x)**2, 1 - m * sin(x)**2, 1 )
         + n / 3 * sin(x)**3
           * carlsonRJ( cos(x)**2, 1 - m * sin(x)**2, 1, 1 - n * sin(x)**2 )
         + period;

}

