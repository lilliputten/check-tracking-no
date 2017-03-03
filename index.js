// ex: set commentstring=/*%s*/ :
/* jshint unused: false, expr: true */

/**
 *
 * @overview CheckTrackingNo
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.03.03, 20:19
 * @version 2017.03.03, 22:38
 *
*/

var

    /*{{{ Debug/info... */
    // DBG = function () { console && console.error.apply(console, arguments); },
    /*}}}*/

    /*{{{ Library... */

    // extend = require('extend'),

    /*}}}*/

    END_CONST
;

var CheckTrackingNo = function (no) /** @lends CheckTrackingNo */ {

    // Data...

    this._no = no;

    // Methods...

    /** this.setNumber ** {{{ Set number
     * @param {string} no -- Number
     * @returns {self}
     */
    this.setNumber = function (no) {
        this._no = no;
        return this;
    };/*}}}*/

    /** this.getNumber ** {{{ Get number
     * @returns {string}
     */
    this.getNumber = function () {
        return this._no;
    },/*}}}*/

    /** this.getUniqueNumberDigit ** {{{ Get digit of unique number (2-9 positions)
     * @param {number} pos - Digit position
     * @return {number}
     */
    this.getUniqueNumberDigit = function (pos) {

        if ( typeof this._no === 'string' ) {
            var c = this._no.charAt(2+pos);
            return parseInt(c, 10);
        }

        // throw 'Not a string value: '+this._no;

        return 0;

    };/*}}}*/

    /** this.getCheckNumber ** {{{ Get checking number
     * @returns {number}
     */
    this.getCheckNumber = function () {
        return this.getUniqueNumberDigit(8);
    };/*}}}*/

    /** this.evalCheckNumber ** {{{ Evaluate cheking number
     * @returns {number}
     */
    this.evalCheckNumber = function () {

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

        return checkNo;

    };/*}}}*/

    /** this.isCorrectCheckNumber ** {{{ Evaluate cheking number
     * @returns {boolean}
     */
    this.isCorrectCheckNumber = function () {
        
        return ( this.getCheckNumber() === this.evalCheckNumber() );
    };/*}}}*/

};

// If in nodejs environment...
if ( module.parent ) {
    // exporting module
    module.exports = CheckTrackingNo;
}
// Called from console: test/example (see tests in *.spec.js)
else {

    var testNumber = process.argv[2] || 'XX410342249YY';

    var trackingNo = new CheckTrackingNo(testNumber);

    console.info( 'Number:', trackingNo.getNumber() );
    console.info( 'evalCheckNumber:', trackingNo.evalCheckNumber() );
    console.info( 'isCorrectCheckNumber:', trackingNo.isCorrectCheckNumber() );

}

