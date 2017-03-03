// ex: set commentstring=/*%s*/ :
/* jshint camelcase: false, unused: false, expr: true */

/**
 *
 * @overview CheckTrackingNo tests
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.03.03, 20:19
 * @version 2017.03.03, 21:51
 *
*/

var

    // Test modules
    // @see http://chaijs.com/
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    // assert = chai.assert(),

    // Import module
    CheckTrackingNo = require('../index'),

    // Sample number
    testNumber = 'XX410342249YY',
    // positions  0123456789012
    // unique no  ..012345678..

    // Object instance
    trackingNo = new CheckTrackingNo(testNumber),
    // Uninitialized object
    emptyTrackingNo = new CheckTrackingNo(),

    // Helper function (get sample number unique number digit at
    // specified position
    testNumberAt = (pos) => {
        return Number( testNumber.charAt(pos+2) );
    },

    undef
;

/*{{{*/describe('getNumber', function() {

    it('returns correct number', function() {
        trackingNo.getNumber().should.equal(testNumber);
    });

    it('returns null number fot uninitialized object', function() {
        should.not.exist( emptyTrackingNo.getNumber() );
    });

});/*}}}*/

/*{{{*/describe('getUniqueNumberDigit', function() {

    it('returns correct digit (#0-7)', function() {
        for ( var i=0; i<8; i++ ) {
            trackingNo.getUniqueNumberDigit(i).should.equal( testNumberAt(i) );
        }
    });

    it('returns check digit (#8)', function() {
        trackingNo.getUniqueNumberDigit(8).should.equal( testNumberAt(8) );
    });

    it('returns NaN on incorrect position (#9)', function() {
        expect( trackingNo.getUniqueNumberDigit(9) ).to.be.NaN;
    });

});/*}}}*/

/*{{{*/describe('getCheckNumber', function() {

    it('get check number', function() {
        trackingNo.getCheckNumber().should.equal( testNumberAt(8) );
    });

});/*}}}*/

/*{{{*/describe('evalCheckNumber', function() {

    it('eval check number', function() {
        trackingNo.evalCheckNumber().should.equal( testNumberAt(8) );
    });

});/*}}}*/


