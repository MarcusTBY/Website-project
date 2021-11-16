var db = require("./databaseConfig");


var nanoIDsDB = {
    storeids: function (SessID, OwnID, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql = `
                INSERT INTO 
                nanoids (SessionID, OwnerID)
                VALUES (?,?);
                `;

                conn.query(sql, [SessID, OwnID], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },


    checksessionid: function (sessid, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql =
                    `
                SELECT *
                FROM nanoids
                WHERE SessionID = ?;
                `

                conn.query(sql, [sessid], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    getsessionid: function (callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql =
                    `
                SELECT *
                FROM nanoids
                WHERE 1 = 1;
                `

                conn.query(sql, [], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    getIDs: function (callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql =
                    `
                SELECT SessionID, OwnerID
                FROM nanoids
                WHERE 1 = 1;
                `

                conn.query(sql, [], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },


    GETQuestions: function (callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql = `
            SELECT * 
            FROM questions
            WHERE 1 = 1;
            `

                conn.query(sql, [], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    StoreQuestion: function (sessid ,questions, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                //database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                  INSERT INTO questions 
                  (sessionID, question)
                  VALUES
                  (? , ?);`
                    ;
                conn.query(sql, [sessid, questions], (error, results) => {
                    conn.end();
                    if (error) {
                        return callback(error, null);
                    }
                    return callback(null, results);
                });
            }
        });
    },

    updateSessStatus:function (sessStatus, SessionID, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                //database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                Update nanoids
                set SIDStarted = ?
                WHERE SessionID = ?
                `
                    ;
                conn.query(sql, [sessStatus, SessionID], (error, results) => {
                    conn.end();
                    if (error) {
                        return callback(error, null);
                    }
                    return callback(null, results);
                });
            }
        });
    },

    getIdForQns: function (sessid, ownid, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql =
                    `
                SELECT *
                FROM nanoids
                WHERE SessionID = ?
                AND OwnerID = ?;
                `

                conn.query(sql, [sessid, ownid], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    storeAnsToQns: function (answer, questions, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                //database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                UPDATE questions
                SET answer = ?
                WHERE question = ?;`
                    ;
                conn.query(sql, [answer, questions], (error, results) => {
                    conn.end();
                    if (error) {
                        return callback(error, null);
                    }
                    return callback(null, results);
                });
            }
        });
    },
};

module.exports = nanoIDsDB;