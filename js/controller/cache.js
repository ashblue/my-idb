define(
    [],
    function () {
        /** @type {object} Reference to master object */
        var SELF = null;

        /** @type {object} Holds a cache of the database. */
        var _data = null;

        /** @type {function} Storage location for timer */
        var _updateCheck = null;

        var cacheInterface = {
            init: function () {
                if (SELF !== null) {
                    return this;
                }

                SELF = this;

                return this;
            },

            setCache: function (writeData, db) {
                _data = {};

                // Loop through all of the data items
                for (var i = writeData.length; i--;) {
                    var table = writeData[i].table;
                    _data[table] = [];

                    // getTable for each with a callback that appends to the cache
                    db.getTable(table, function(e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            _data[cursor.source.name].push(cursor.value);
                            cursor.continue();
                        }
                    });
                }
            },

            setCacheLine: function (table, key, keyValue, writeValue) {
                var tableData = _data[table];

                for (var i = tableData.length; i--;) {
                    if (tableData[i][key] === keyValue) {
                        return _data[table][i] = writeValue;
                    }
                }

                return {};
            },

            setCacheTimer: function(checkVal, writeData, db) {
                var checkStatus = function() {
                    if (checkVal) {
                        SELF.setCache(writeData, db);
                    } else {
                        _updateCheck = setTimeout(checkStatus, 100);
                    }
                };
                _updateCheck = setTimeout(checkStatus, 100);
            },

            getCache: function () {
                return _data;
            }
        };

        return cacheInterface.init();

        ///**
        // * Accesses the cache and returns the array of data for a table
        // * @param {string} table Table to access
        // * @returns {array} Each line in the array reprents a line in the database
        // */
        //getDataTable: function(table) {
        //    return _cache[table];
        //},
        //
        ///**
        // * Gets and returns a specific line of a table via a key with a value from
        // * the cache.
        // * @returns {object} Only returns one line or an empty object
        // * @todo Untested
        // */
        //getDataTableKey: function(table, key, value) {
        //    var tableData = _cache[table];
        //
        //    for (var i = tableData.length; i--;) {
        //        if (tableData[i][key] === value) {
        //            return tableData[i];
        //        }
        //    }
        //
        //    return {};
        //},
    }
);