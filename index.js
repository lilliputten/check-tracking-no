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

    /** libs {{{ Libraries... */
    libs = {
        extend : require('extend'),
        yaml : require('js-yaml'),
        fs : require('fs'),
        path : require('path'),
        downcache : require('downcache'),
        cheerio : require('cheerio'),
        // vow : require('vow'),
        url : require('url'),
    },
    /*}}}*/

    // Helper functions...

    /** checkLib ** {{{ Check existing of lib and requuire it if absent
     * @param {string} [libId] - Module identifier fot store ib libs
     * @param {string} libName - Library package npm name
     * @return {object} - Required/stored module
     */
    checkLib = function (libId, libName) {

        // If only one parameter (libId=libName)...
        if ( !libName ) {
            libId = libId;
        }

        // If module absent...
        if ( !libs[libId] ) {
            libs[libId] = require(libName);
        }

        return libs[libId];

    },/*}}}*/

    /** loadFile ** {{{ Load text/data file
     * @param {string} fileName - File name
     */
    loadFile = function (fileName) {

        // fileName = this._expandPath(fileName, '');

        if ( libs.fs.existsSync(fileName) && !libs.fs.statSync(fileName).isDirectory() ) {
            return libs.fs.readFileSync(fileName, 'utf8');
        }

        return '';

    },/*}}}*/

    /** loadYaml ** {{{ Load yaml file
     * @param {string} fileName - File name
     */
    loadYaml = function (fileName) {

        var fileContent = loadFile(fileName);

        return libs.yaml.load(fileContent) || {};

    },/*}}}*/

    /** loadUrl ** {{{ Load url (config.countriesListUrl)
     * @returns {Promise}
     */
    loadUrl = function (url) {

        return new Promise((resolve, defer) => {

            libs.downcache(url, (error, response, data) => {

                if ( error ) {
                    console.error( 'loadUrl error', error, response.statusCode );
                    /*DEBUG*//*jshint -W087*/debugger;
                    return reject({
                        error : error,
                        response : response,
                    });
                }

                return resolve(data);

            });

        });

    },/*}}}*/

    // Config...

    /** defaultConfig ** {{{ Default config values */
    defaultConfig = {

        configFileName : '.check-tracking-no.yaml',

        /** Адрес ресурса со списком стран */
        countriesListUrl : 'https://countrycode.org/',

        /** Время жизни списка стран в кэше */
        countriesListCacheTime : 1000,

    },/*}}}*/

    /** config ** {{{ Extending config from default config parameters and module configuration file */
    config = libs.extend({},
        defaultConfig,
        loadYaml( libs.path.posix.join(__dirname, defaultConfig.configFileName) )
    ),/*}}}*/

    /** staticParams ** {{{ Module static params */
    staticParams = {

        /** List of caountries loading and parsing from from url/cache */
        countriesList : null,

    },/*}}}*/

    END_STATIC
;

var CheckTrackingNo = function (no) /** @lends CheckTrackingNo */ {

    // Data...

    /** config */
    this.config = {};
    libs.extend(this.config, config);

    /** Number */
    this.no = no;

    // Methods...

    /** this.setConfigParam ** {{{ Set config parameter
     * @param {string} id
     * @param {*} value
     * @return {self}
     */
    this.setConfigParam = function (id, value) {

        this.config[id] = value;

        return this;

    };/*}}}*/

    /** this.getConfigParam ** {{{ Set config parameter
     * @param {string} id
     */
    this.getConfigParam = function (id) {

        return this.config[id];

    };/*}}}*/

    /** this.extendConfig ** {{{ Extend config with params hash values
     * @param {object} config
     * @return {self}
     */
    this.extendConfig = function (config) {

        libs.extend(this.config, config);

        return this;

    },/*}}}*/

    /** this.loadConfig ** {{{
     * @param {string} fileName
     * @return {self}
     */
    this.loadConfig = function (fileName) {

        fileName = fileName || this.config.configFileName || defaultConfig.configFileName;

        this.extendConfig(loadYaml(fileName));

        return this;

    };/*}}}*/

    /** this.setNumber ** {{{ Set number
     * @param {string} no -- Number
     * @returns {self}
     */
    this.setNumber = function (no) {
        this.no = no;
        return this;
    };/*}}}*/

    /** this.getNumber ** {{{ Get number
     * @returns {string}
     */
    this.getNumber = function () {
        return this.no;
    },/*}}}*/

    /** this.getUniqueNumberDigit ** {{{ Get digit of unique number (2-9 positions)
     * @param {number} pos - Digit position
     * @return {number}
     */
    this.getUniqueNumberDigit = function (pos) {

        if ( typeof this.no === 'string' ) {
            var c = this.no.charAt(2+pos);
            return parseInt(c, 10);
        }

        // throw 'Not a string value: '+this.no;

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

    /** this.getCountryCode ** {{{ Country code by number
     * @returns {string} - 2-symbol contry code
     */
    this.getCountryCode = function () {

        if ( typeof this.no === 'string' ) {
            return this.no.substr(11,2);
        }

        return '??';

    };/*}}}*/

    /** this.getServiceCode ** {{{ Country code by number
     * @returns {string} - 2-symbol contry code
     */
    this.getServiceCode = function () {

        if ( typeof this.no === 'string' ) {
            return this.no.substr(0,2);
        }

        return '??';

    };/*}}}*/

    /** this.parseCountriesList ** {{{ Parsing received/cached countries data from html page
     * @see `test/countries.sample.html`
     * @param {string} data - html page data
     * @returns {object[]}
     */
    this.parseCountriesList = function (data) {
        
        try {

            var $ = libs.cheerio.load(data, this.config.cheerioOptions);

            var list = {};

            $('table.main-table tbody tr').map((n, el) => {
                var item = {
                    code : $(el).find('> td:nth-child(3)').text().replace(/^(\w+).*$/, '$1'),
                    name : $(el).find('> td:nth-child(1) > a').text(),
                    url : $(el).find('> td:nth-child(1) > a').attr('href'),
                };
                list[item.code] = item;
            });

            staticParams.countriesList = list;

            return list;

        }
        catch (e) {
            console.error( 'parseCountriesList catch:', e );
            /*DEBUG*//*jshint -W087*/debugger;
        }

    };/*}}}*/

    /** this.loadCountriesList ** {{{
     * Load and parse country list.
     * Store result in `staticParams.countriesList`.
     * @return {Promise}
     */
    this.loadCountriesList = function () {
        
        // If countries list already loaded...
        if ( staticParams.countriesList ) {
            // ...Resolve data
            return Promise.resolve(staticParams.countriesList);
        }

        // ...Else parse loaded/cached html and resolve result...
        // console.log('Loading countries url...');
        var promise = loadUrl(this.config.countriesListUrl)
            .then((data) => {
                // console.log('Countries list loaded.');
                return this.parseCountriesList(data);
            })
        ;

        return promise;

    };/*}}}*/

    /** this.hasCountryInfo ** {{{ Is countries list loaded and contain specified country info entry
     * @returns {boolean}
     */
    this.hasCountryInfo = function (countryCode) {

        return !! ( staticParams.countriesList && typeof staticParams.countriesList[countryCode] === 'object' );

    };/*}}}*/
    /** this.getCountryInfo ** {{{ Get country info entry
     * @returns {object}
     */
    this.getCountryInfo = function (countryCode) {

        return this.hasCountryInfo(countryCode) ? staticParams.countriesList[countryCode] : {};

    };/*}}}*/

    /** this.getCountryName ** {{{ Get country name (loaded from `config.countriesListUrl`)
     * Required to fulfilled {@see #loadCountriesList}.
     * @returns {string}
     */
    this.getCountryName = function () {

        var countryCode = this.getCountryCode();
        var countryInfo = this.getCountryInfo(countryCode);

        return countryInfo.name || countryCode;

    };/*}}}*/

    /** this.getCountryUrl ** {{{ Get country url (loaded from `config.countriesListUrl`)
     * Required to fulfilled {@see #loadCountriesList}.
     * @param {object} [options] - Url processing parameters
     * @param {boolean} [options.resolve=true] - Resolve url to `config.countriesListUrl`
     * @returns {string}
     */
    this.getCountryUrl = function (options) {

        options = options || {};

        var countryCode = this.getCountryCode();
        var countryInfo = this.getCountryInfo(countryCode);

        var countryUrl = countryInfo.url || countryCode;

        if ( options.resolve !== false ) {
            var rootUrl = this.config.countriesListUrl || '';
            countryUrl = require('url').resolve(rootUrl, countryUrl);
        }

        return countryUrl;

    };/*}}}*/

    /** this.parseServiceCode ** {{{ Parse service code
     * @returns {Promise}
     */
    this.parseServiceCode = function () {

        var serviceCode = this.getServiceCode();

        return require('./lib/parse-service-code')(serviceCode);

    };/*}}}*/

};

// If in nodejs environment...
if ( module.parent ) {
    // exporting module
    module.exports = CheckTrackingNo;
}
// Called from console: test/example (see tests in *.spec.js)
else {

    var testNumber = process.argv[2] || 'RS410342249EE';

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

}

