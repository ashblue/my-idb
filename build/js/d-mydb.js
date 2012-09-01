/**
 * @example usage window.myDB.setDB('new', 1, yourJSONdata);
 * @todo
 */
var myDB = myDB || {};

(function (myDB) {
    /** @type {object} Reference to the db singleton */
    var SELF = null;

    /** @type {boolean} Whether or not to enable the debugger */
    var _debug = false;

    var _private = {
        /**
         * Callback in-case IndexedDB fails to initialize
         */
        loadFailure: function () {
            return alert('Your browser does not support IndexedDB');
        }
    };

    /** @type {object} Public interface for working with myDB. Directly attached to the window */
    myDB.init = function () {
        if (SELF !== null) {
            return;
        }

        SELF = this;

        myDB.support
            .setPrefixes()
            .testDb(_private.loadFailure);
    };

    /**
     * Set the database, should only be called once per page load.
     * @param {string} dbName Name of the database you want to retrieve or create
     * @param {number} ver Version of the database you want, new version triggers
     * an upgrade
     * @param {object} data Data you want to use to create or upgrade
     * your database
     * @returns {self}
     * @example myDB.setDB('myCustomDBName', 1, testDB);
     */
    myDB.setDB = function (dbName, ver, data) {
        myDB.getDB.request(dbName, ver, data);

        return this;
    };

    /**
     * Overwrite the callback that fires if indexedDB fails to load. By default
     * it fires an alert
     * @param {function} callback Function to fire on failure
     * @returns {self}
     * @example
     * myDB.setNoDBCallback(function() {
     *   console.error('get a real browser');
     * });
     */
    myDB.setNoDBCallback = function (callback) {
        _private.loadFailure = callback;

        return this;
    };

    /**
     * Retrive a specific table from the cache
     * @param {string} table Name of the table you want to get
     * @returns {array} Returns an array with all the table's objects
     * @example myDB.getTable('levels');
     */
    myDB.getTable = function (table) {
        return myDB.getDB.getDataTable(table);
    };

    /**
     * Gets and returns a specific line of a table via a key with a value from
     * the cache.
     * @param {string} table Name of the table such as 'player'
     * @param {string} key Main key for the table, such as 'id'
     * @param {mixed} value Value you are looking for in a specific key,
     * for example you might look for a key of 'id' and value of 5
     * @returns {object} Only returns one line or an empty object
     * @example myDB.getTableLine('achievements', 'id', 5);
     */
    getTableLine = function (table, key, value) {
        return myDB.getDB.getDataTableKey(table, key, value);
    };

    /**
     * Modify an existing line of data in a table and update the cache to reflect it.
     * @param {string} table Name of the table such as 'achievements'
     * @param {object} data Object to write such as 'id', for the cache
     * @param {mixed} keyValue Literal value of the key you want to set, for updating the cache
     * @param {object} value The object to replace the existing data such as { level: 2, unlocked: true }
     * in the database
     * @returns {self}
     * @example myDB.setTableLine('achievements', 'id', 5, { level: 2, unlocked: true });
     */
    setTableLine = function (table, key, keyValue, value) {
        myDB.getDB.setData(table, key, keyValue, value);
        return this;
    };

    myDB.init();

}(myDB));
