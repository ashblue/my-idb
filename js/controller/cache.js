define(
    [],
    function () {
        /** @type {object} Holds a cache of the database. */
        var _data = null;

        /**
         * Rebuilds the cache from scratch
         */
        //setCache: function() {
        //    _cache = {};
        //
        //    // Loop through all of the data items
        //    for (var i = _writeData.length; i--;) {
        //        var table = _writeData[i].table;
        //        _cache[table] = [];
        //
        //        // getTable for each with a callback that appends to the cache
        //        _private.getTable(table, function(e) {
        //            var cursor = e.target.result;
        //            if (cursor) {
        //                _cache[cursor.source.name].push(cursor.value);
        //                cursor.continue();
        //            }
        //        });
        //    }
        //},
        
                // Set the database cache if the version isn't changing
                //if (currentVersion === version) {
                //    _private.setCache();
                //// Database is still updating, check back later
                //} else {
                //    var checkStatus = function() {
                //        if (_ready) {
                //            _private.setCache();
                //        } else {
                //            _updateCheck = setTimeout(checkStatus, 100);
                //        }
                //    };
                //    _updateCheck = setTimeout(checkStatus, 100);
                //}

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