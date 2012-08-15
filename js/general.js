console.log(db);

db.init();
db.getDB('fdsa', 1, defaultDB);

//db.getDB('testDB', 1, function (e) {
//    var dbWriter = db.getDBWriter(e);
//
//    // Replace below with db.setDBStructure
//
//    //var customerData = [
//    //    { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'mailto:bill@company.com' },
//    //    { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'mailto:donna@home.org' }
//    //];
//    //
//    //var table = dbWriter.createObjectStore('customers', { keyPath: 'ssn' });
//    //table.createIndex('name', 'name', { unique: false });
//    //table.createIndex('email', 'email', { unique: true });
//    //
//    //for (var i in customerData) {
//    //    table.add(customerData[i]);
//    //}
//
//    console.info('onupgradeneeded event fired');
//});
