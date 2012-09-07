console.log(window.myDB);

myDB.setSuccess = function () {
    myDB.quickReplace('player', 'name', 'data', 'new name 2');
};

myDB.setDB('akr47a', 1, testDB);