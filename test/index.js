// ex: set commentstring=/*%s*/ :
/* jshint unused: false, expr: true */

/**
 *
 * @overview CheckTrackingNo tests
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.03.03, 20:19
 * @version 2017.03.03, 22:38
 *
*/

// console.info('dirname', __dirname);
// console.info('cwd', process.cwd());
var

    // Requires...
    fs = require('fs'),
    path = require('path'),

    // Test modules...
    // @see http://chaijs.com/
    // chaiSinon = require('sinon-chai'),
    chai = require('chai')
        // .use( chaiSinon )
        .use( require('sinon-chai') )
        .use( require('chai-as-promised') )
    ,
    // chaiAsPromised = require('chai-as-promised'),
    // chai.use(chaiAsPromised);
    should = chai.should(),
    expect = chai.expect,
    // sinon = chai.sinon,
    // assert = chai.assert,

    // Import module
    CheckTrackingNo = require('../index'),

    // Sample number
    testNumber = 'RS410342249AF',
    countryCode = 'AF',
    countryName = 'Afghanistan',
    countryUrl = '/afghanistan',
    // positions  0123456789012
    // unique no  ..012345678..

    // Object instance
    trackingNo = new CheckTrackingNo(testNumber),
    // Uninitialized object
    emptyTrackingNo = new CheckTrackingNo(),

    // Helper functions...

    /** testNumberAt ** {{{ Helper function (get sample number unique number digit at specified position
     * @param {number} pos - digit position
     * @returns {number}
     */
    testNumberAt = (pos) => {
        return Number( testNumber.charAt(pos+2) );
    },/*}}}*/

    undef
;

/*{{{*/describe('getNumber', () => {

    it('returns correct number', () => {
        trackingNo.getNumber().should.equal(testNumber);
    });

    it('returns null number fot uninitialized object', () => {
        should.not.exist( emptyTrackingNo.getNumber() );
    });

});/*}}}*/

/*{{{*/describe('getUniqueNumberDigit', () => {

    it('returns correct digit (#0-7)', () => {
        for ( var i=0; i<8; i++ ) {
            trackingNo.getUniqueNumberDigit(i).should.equal( testNumberAt(i) );
        }
    });

    it('returns check digit (#8)', () => {
        trackingNo.getUniqueNumberDigit(8).should.equal( testNumberAt(8) );
    });

    it('returns NaN on incorrect position (#9)', () => {
        expect( trackingNo.getUniqueNumberDigit(9) ).to.be.NaN;
    });

});/*}}}*/

/*{{{*/describe('getCheckNumber', () => {

    it('get check number', () => {
        trackingNo.getCheckNumber().should.equal( testNumberAt(8) );
    });

});/*}}}*/

/*{{{*/describe('evalCheckNumber', () => {

    it('eval check number', () => {
        trackingNo.evalCheckNumber().should.equal( testNumberAt(8) );
    });

});/*}}}*/

/*{{{*/describe('isCorrectCheckNumber', () => {

    it('correct check number', () => {
        trackingNo.isCorrectCheckNumber().should.be.true;
    });

    it('invalid check number (for uninitialized object)', () => {
        emptyTrackingNo.isCorrectCheckNumber().should.be.false;
    });

});/*}}}*/

/*{{{*/describe('getCountryCode', () => {

    it('get code', () => {
        trackingNo.getCountryCode().should.equal(countryCode);
    });

    it('get code for undefined number', () => {
        emptyTrackingNo.getCountryCode().should.equal('??');
    });

});/*}}}*/

/*{{{*/describe('getServiceCode', () => {

    it('get code', () => {
        trackingNo.getServiceCode().should.equal('RS');
    });

    it('get code for undefined number', () => {
        emptyTrackingNo.getServiceCode().should.equal('??');
    });

});/*}}}*/

/*{{{*/describe('Config...', () => {

    it('default countriesListUrl', () => {
        trackingNo.getConfigParam('countriesListUrl').should.equal('https://countrycode.org/');
    });

    it('extendConfig -> countriesListUrl', () => {
        var testUrl = 'https://exapmple.com/';
        trackingNo.extendConfig({ countriesListUrl : testUrl });
        trackingNo.getConfigParam('countriesListUrl').should.equal(testUrl);
    });

    it('loadConfig(assets/test.config.yaml) -> countriesListUrl', () => {
        var sampleConfigFile = path.posix.join(__dirname, 'assets/test.config.yaml');
        trackingNo.loadConfig(sampleConfigFile);
        trackingNo.getConfigParam('countriesListUrl').should.equal('http://test.org/');
    });

});/*}}}*/

/*{{{*/describe('Parse countries sample (assets/countries.sample.html)...', () => {

    var sampleHtmlFile = path.posix.join(__dirname, 'assets/countries.sample.html');
    var sampleHtml = fs.readFileSync(sampleHtmlFile, 'utf8');

    var list = trackingNo.parseCountriesList(sampleHtml);

    it('contain country', () => {
        expect(list).to.contain.keys(countryCode);
    });

    it('correct country name', () => {
        list.AF.name.should.equal('Afghanistan');
    });

    it('hasCountryInfo', () => {
        trackingNo.hasCountryInfo(countryCode).should.be.true;
    });

    it('getCountryInfo->name', () => {
        trackingNo.getCountryInfo(countryCode).name.should.equal(countryName);
    });

    it('getCountryName', () => {
        trackingNo.getCountryName().should.equal(countryName);
    });

    it('getCountryUrl', () => {
        trackingNo.getCountryUrl({ resolve : false }).should.equal(countryUrl);
    });

});/*}}}*/

/*{{{*/describe('Parse service code...', () => {

    it('fulfilled and have property typeExplained', () => {

        return trackingNo.parseServiceCode().should.be.fulfilled.and.should.eventually.have.property('typeExplained');

    });

});/*}}}*/

