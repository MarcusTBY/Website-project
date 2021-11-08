
console.log("---------------------------------------------")
console.log("ades CA2 > controller > databaseConfig.js")
console.log("---------------------------------------------")



//-------------------------------------------------
// imports
//-------------------------------------------------
var mysql = require('mysql');

//-------------------------------------------------
// configurations
//-------------------------------------------------

//-------------------------------------------------
// objects / functions
//-------------------------------------------------
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Myhp25lol$",
            database: "ca2-project"
        });

        return conn;
    }
};


//-------------------------------------------------
// exports
//-------------------------------------------------
module.exports = dbconnect;