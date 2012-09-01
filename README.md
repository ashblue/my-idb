My IDB (Indexed Database)
==============

My Indexed Database (IDB) gives you the ability to turn a JSON file into an IndexedDB
database that can be maintained and updated via a JSON file. It uses a combination of
caching and asynchronous database calls to maximize speed. Includes support for
old and IndexedDB implementations via polfyills and fallbacks.

## Setup
Just include mydb.js in at the bottom of your page and you're good to go.

        <script type="text/javascript" src="mydb.js"></script>
    </body>

## JSON Structure
When creating your database, you must pass in an array filled with JSON data.
The JSON data you pass should look something like this.

    var testDB = [
        {
            table: 'achievements',
            keyPath: 'id',
            index: [
                {
                    name: 'id',
                    unique: true
                }
            ],
            data: [
                {
                    id: 1,
                    name: 'asdf',
                    unlocked: false
                }
            ]
        },
        {
            table: 'levels',
            keyPath: 'level',
            index: [
                {
                    name: 'level',
                    unique: true
                }
            ],
            data: [
                {
                    level: 1,
                    unlocked: true
                },
                {
                    level: 2,
                    unlocked: false
                },
                {
                    level: 3,
                    unlocked: false
                }
            ]
        }
    ];

### How your IndexedDB upgrades via JSON
When a database upgrade occures, all existing data will be ignored. If new JSON
data is discovered, it will be added for you automatically.

Please note that data no longer in your database will not be removed on upgrade.
As deletion has not been integrated yet, it will just sit in the database instead.

## API
You can interact with your database with the following commands.

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
    myDB.setDB(dbName, ver, data);

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
    myDB.setNoDBCallback(callback);

    /**
     * Retrive a specific table from the cache
     * @param {string} table Name of the table you want to get
     * @returns {array} Returns an array with all the table's objects
     * @example myDB.getTable('levels');
     */
    myDB.getTable(table);

    /**
     * Gets and returns a specific line of a table via a key with a value from
     * the cache.
     * @param {string} table Name of the table such as 'achievements'
     * @param {string} key Main key for the table, such as 'id'
     * @param {mixed} value Value you are looking for in a specific key,
     * for example you might look for a key of 'id' and value of 5
     * @returns {object} Only returns one line or an empty object
     * @example myDB.getTableLine('achievements', 'id', 5);
     */
    myDB.getTableLine(table, key, value);

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
    myDB.setTableLine(table, key, keyName, value);