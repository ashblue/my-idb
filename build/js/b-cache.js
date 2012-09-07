var myDB = myDB || {};

(function (myDB) {
    /** @type {object} Reference to master object */
    var SELF = null;

    /** @type {object} Holds a cache of the database */
    var _data = null;

    /** @type {object} Stores key path declarations */
    var _dataKeyPath = {};

    /** @type {function} Storage location for timer */
    var _updateCheck = null;

    myDB.cache = {
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
            var writeTotal = 0, writeCount = 1;
            for (var i = writeData.length; i--;) {
                var table = writeData[i].table;
                _dataKeyPath[table] = writeData[i].keyPath;
                _data[table] = [];
                writeTotal += 1;

                // getTable for each with a callback that appends to the cache
                db.getTable(table, function(e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        _data[cursor.source.name].push(cursor.value);
                        cursor.continue();
                    } else if (writeTotal === writeCount) {
                        myDB.setSuccess();
                    } else if (cursor === null) {
                        writeCount += 1;
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
        },

        getKey: function (table) {
            return _dataKeyPath[table];
        }
    };

    myDB.cache.init();
}(myDB));
