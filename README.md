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
    var testNumber = 'RS410342249EE';

    var CheckTrackingNo = require('check-tracking-no');

    var trackingNo = new CheckTrackingNo(testNumber);

    trackingNo.loadConfig();

    console.info( 'Number:', trackingNo.getNumber() );
    console.info( 'evalCheckNumber:', trackingNo.evalCheckNumber() );
    console.info( 'isCorrectCheckNumber:', trackingNo.isCorrectCheckNumber() );
    console.info( 'getServiceCode:', trackingNo.getServiceCode() );
    console.info( 'getCountryCode:', trackingNo.getCountryCode() );

    trackingNo.loadCountriesList()
        .then((data) => {
            console.info( 'getCountryName:', trackingNo.getCountryName() );
            console.info( 'getCountryUrl:', trackingNo.getCountryUrl() );
        })
    ;

    trackingNo.parseServiceCode()
        .then((data) => {
            data.typeExplained && console.info( 'typeExplained:', data.typeExplained);
            data.codeExplained && console.info( 'codeExplained:', data.codeExplained);
        })
    ;
```

Description
-----------

Algorithm description see at
[wiki page (EN)](https://en.wikipedia.org/wiki/Tracking_number),
[wiki page (RU)](https://ru.wikipedia.org/wiki/Почтовый_идентификатор).
See also [Track number decoding (RU)](http://shopinfo.com.ua/threads/rasshifrovka-trek-nomera.1170).

Working with 13-digit mail tracking numbers:
```
Sample No: RS410342249EE
Positions: 0123456789012
           |||||||||||** . ##11-12 . Country code (##11-12)
           ||||||||||* ... #10 ..... Check digit (#10)
           ||******** .... ##2-9 ... 8-digit unique number (##2-9)
           ** ............ ##0-1 ... Mailing type (##0-1)
```
Using external [Country Codes](https://countrycode.org/) list. See
`config.countriesListUrl` and `parseCountriesList` method.

Check number evaluating algorithm
---------------------------------

See method [evalCheckNumber](https://github.com/lilliputten/check-tracking-no/blob/v0.0.3/index.js#L246-L257) in
[index.js](https://github.com/lilliputten/check-tracking-no/blob/master/index.js).

``` javascript
var multNumbers = [ 8, 6, 4, 2, 3, 5, 9, 7 ];
var summ = 0;
for ( var i=0; i<8; i++ ) {
    var n = this.getUniqueNumberDigit(i);
    n *= multNumbers[i];
    summ += n;
}
var checkNo = 11 - ( summ % 11 );
if ( checkNo === 10 ) { checkNo = 0; }
if ( checkNo === 11 ) { checkNo = 5; }
```

