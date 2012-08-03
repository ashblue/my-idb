/*
 * IndexedDB Interface to access the API. Contains a library of pre-built math equations, very
 * useful for generating random numbers and simplifying other
 * complex logic.
 * @link https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
 * @author Ash Blue ash@blueashes.com
*/

var db;

(function () {
    db = {
        init: function () {
            // This will improve our code to be more readable and shorter
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            
            // Now we can open our database
            var request = window.indexedDB.open("MyTestDatabase");
            console.log(request);
        },

        testDB: function () {

        }
    };


}());