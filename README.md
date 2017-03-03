[![GitHub Release](https://img.shields.io/github/release/lilliputten/check-tracking-no.svg)](https://github.com/lilliputten/check-tracking-no/releases)
[![Build Status](https://api.travis-ci.org/lilliputten/check-tracking-no.svg?branch=master)](https://travis-ci.org/lilliputten/check-tracking-no)
[![npm version](https://badge.fury.io/js/check-tracking-no.svg)](https://badge.fury.io/js/check-tracking-no)

# check-tracking-no

Simple minimalistic module for checking of mailing tracking numbers.

Install
-------

```shell
npm install check-tracking-no --save
```

Usage
-----

```javascript
var testNumber = 'XX410342249YY';
var CheckTrackingNo = require('check-tracking-no');
var trackingNo = new CheckTrackingNo(testNumber);
console.info( 'trackingNo', trackingNo.getNumber() );
console.info( 'evalCheckNumber', trackingNo.evalCheckNumber() );
```

Description
-----------

Algorithm description see at [wiki page (RU)](https://ru.wikipedia.org/wiki/Почтовый_идентификатор).

Working with 13-digit mail tracking numbers:
```
Sample No: XX123456789YY
Positions: 0123456789012
           |||||||||||** . ##11-12 . Country code (##11-12)
           ||||||||||* ... #10 ..... Check digit (#10)
           ||******** .... ##2-9 ... 8-digit unique number (##2-9)
           ** ............ ##0-1 ... Mailing type (##0-1)
```

Check number evaluating algorithm
---------------------------------

``` javascript
var multNumbers = [ 8, 6, 4, 2, 3, 5, 9, 7 ];
var summ = 0;
for ( var i=0; i<8; i++ ) {
    var n = trackingNo.getUniqueNumberDigit(i);
    n *= multNumbers[i];
    summ += n;
}
var checkNo = 11 - ( summ % 11 );
if ( checkNo === 10 ) { checkNo = 0; }
if ( checkNo === 11 ) { checkNo = 5; }
```

