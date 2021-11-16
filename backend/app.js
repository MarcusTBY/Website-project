// Import required modules
// e.g. const Ama = require('./logic/ama');

const express = require('express');
const cors = require('cors');
const nanodb = require('./data')
// const { nanoid } = require('nanoid');
const { customAlphabet } = require('nanoid');
const dbconnect = require('./databaseConfig');
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)


// Create required middleware

const app = express();
app.use(cors());

//----- ------ ------- ------
//Global variable
//----- ------ ------- ------

const sessionsID = {};
const OwnerID = {};
const isstarted = {};
const questions = {};

//create random generatedID
//------------------------------

//
app.post('/idcreate', function (req, res) {
    // Generating a new session Id
    const sessionId = nanoid();
    const ownerId = nanoid();

    // Set sessionId as new key of sessions object, set the value to 1
    sessionsID[sessionId] = 1;
    OwnerID[ownerId] = sessionId;
    isstarted[sessionId] = 0;

    nanodb.storeids(sessionId, ownerId, function (err, result) {
        if (!err) {
            res.json({
                session_id: sessionId,
                owner_id: ownerId,
            });
        }
        else {
            res.status(500).send("Problem storing ids in sql");
            console.log(err);
        };
    })
});

//
app.get('/go', function (req, res) {

    const sessidvalue = req.query.input

    console.log('id from input: ' + sessidvalue);

    nanodb.getsessionid(function (err, result) {
        console.log('-----------------------')
        // console.log('all sess id: ' + result)
        rows = JSON.stringify(result)
        // console.log(rows)
        console.log('-----------------------')
        if (!err) {
            var wrongid = false
            var tempsessid;

            for (i = 0; i < result.length; i++) {
                if (result[i].SessionID == sessidvalue) {
                    wrongid = false;
                    tempsessid = result[i].SessionID;
                    break
                }
                else {
                    wrongid = true;
                }
            }

            if (wrongid) {
                console.log('wrong id given / does not match')
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong/No SessionID' }));
            }
            else {
                res.status(200).send(JSON.stringify({ Session_ID: tempsessid }))
            }

        } else {
            res.status(500).send("Error getting questions");
            console.log(err)
        }
    })


});

//
app.get('/mgo', function (req, res) {

    const sessidvalue = req.query.input

    const owneridvalue = req.query.inputo



    console.log('id from input: ' + sessidvalue);

    console.log('id from owner input: ' + owneridvalue);

    nanodb.getsessionid(function (err, result) {
        console.log('-----------------------')
        // console.log('all sess id: ')
        rows = JSON.stringify(result)
        // console.log(rows)
        console.log('-----------------------')
        if (!err) {
            var wrongid = false
            var wrongoid = false
            var tempsessid;
            var tempownid;

            for (i = 0; i < result.length; i++) {
                if (result[i].SessionID == sessidvalue) {
                    wrongid = false;
                    tempsessid = result[i].SessionID;
                    console.log('return temp owner id: ' + tempsessid)
                    console.log('correct id')
                    break
                }
                else {
                    console.log(result[i].SessionID)
                    console.log('wrongid')
                    wrongid = true;
                }
            }

            console.log('checking for ownerid validity....')
            console.log('----------------------------------')
            //for loop to check if input for ownerid exsist
            for (j = 0; j < result.length; j++) {


                if (result[j].OwnerID == owneridvalue) {
                    wrongoid = false;
                    tempownid = result[j].OwnerID;
                    console.log('return temp owner id: ' + tempownid)
                    console.log('correct id')
                    break
                }
                else {
                    console.log(result[j].OwnerID)
                    wrongoid = true;
                    console.log('wrongid')
                }


            }

            if (wrongid) {
                console.log(JSON.stringify({ Wrong: 'Wrong SessionID' }))
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong SessionID' }));
            }
            else if (wrongoid) {
                console.log(JSON.stringify({ Wrong: 'Wrong OwnerID' }))
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong OwnerID' }));
            }
            else {
                //check if whether its owner
                if (j != i) {

                    console.log("sessionid from sql=: " + result[i].SessionID)
                    console.log(result[i])
                    console.log(result[j])
                    console.log("ownerid from sql: " + result[j].OwnerID)
                    console.log('ownerid object: ' + OwnerID)
                    console.log(OwnerID)
                    console.log('------------------------------')


                    console.log('Sessionid object: ' + sessionsID)
                    console.log(sessionsID)
                    console.log('------------------------------')


                    console.log('You are not a owner')
                    res.status(400).send(JSON.stringify({ reason: "You're not a owner" }));
                }
                else {
                    res.status(200).send(JSON.stringify({
                        Session_ID: tempsessid,
                        Owner_ID: tempownid,
                    }))
                }
            }

        } else {
            res.status(500).send("Error getting questions");
            console.log(err)
        }
    })


});


//Get Qns
app.get('/getqns', function (req, res) {


    const SID = req.query.sessionid;
    var loadqnsid = [];
    var loadqns = [];


    nanodb.GETQuestions(function (err, result) {
        if (!err) {
            for (i = 0; i < result.length; i++) {
                if (result[i].sessionID == SID) {
                    loadqnsid.push({ id: result[i].id })
                    loadqns.push({ questions: result[i].question })

                }
                // lastQno = result[i].id + 1
                // sessQns = result[i].question
            }
            console.log; ('line-----------------------')
            console.log(loadqnsid);
            console.log(loadqns);

            // console.log(result)
            // resultobj = {result};

            // console.log(resultobj);
            nanodb.checksessionid(SID, function (err, result) {
                if (!err) {
                    var resultArray = Object.values(JSON.parse(JSON.stringify(result)))
                    var sessStarted;
                    // console.log(result)
                    console.log('checking for sessionid validity....')
                    console.log('----------------------------------')
                    //for loop to check if input for sessid exsist
                    // console.log(resultArray)
                    // console.log(resultArray[0].SIDStarted)
                    sessStarted = resultArray[0].SIDStarted;

                    // console.log('is session started: ' + sessStarted)

                    console.log('sessionid is == ' + SID)
                    res.status(200).json({
                        allqnsid: loadqnsid,
                        allqns: loadqns,
                        isStarted: sessStarted,
                        sessionid: SID,
                    })
                }
                else {

                }
            })


        }
        else {
            res.status(500).send("Error getting questions");
            console.log(err)
        }
    })

});


//Create Qns
app.post('/createqns', function (req, res) {

    const SID = req.query.sessionid;

    const retrieveQ = req.query.textarea;


    console.log(retrieveQ);

    console.log('sessid = ' + SID)


    nanodb.getsessionid(function (err, result) {
        if (!err) {

            var wrongid = false
            var tempsessid;
            var sessStarted;
            // console.log(result)
            console.log('checking for sessionid validity....')
            console.log('----------------------------------')
            //for loop to check if input for sessid exsist
            for (i = 0; i < result.length; i++) {
                if (result[i].SessionID == SID) {
                    wrongid = false;
                    tempsessid = result[i].SessionID;
                    sessStarted = result[i].SIDStarted;
                    console.log('return temp session id: ' + tempsessid)
                    console.log('correct id')
                    break
                }
                else {
                    // console.log(result[i].SessionID)
                    wrongid = true;
                    // console.log('wrongid')
                }

                console.log('is session started: ' + sessStarted)
            }

            if (wrongid) {
                res.status(400).send(JSON.stringify({ sessionid: 'does not exsist' }))
            }
            else {
                console.log('status of current ID: ' + tempsessid + ' is = ' + result[i].SIDStarted)
                if (result[i].SIDStarted == 1) {
                    console.log('id is:')
                    console.log(result[i].id)
                    if (retrieveQ == '') {
                        console.log('empty qns here:')
                        res.status(400).send(JSON.stringify({ emptyqns: 'u have not keyed anything!' }))
                    }
                    else {
                        nanodb.StoreQuestion(SID, retrieveQ, function (err, result) {
                            if (!err) {
                                console.log('all ok!!!')
                                nanodb.GETQuestions(function (err, result) {
                                    if (!err) {
                                        console.log('get question SQL:')
                                        var Qno = '';
                                        var qforSess = '';
                                        var lastQno;
                                        console.log("get qns result length:")
                                        console.log(result.length)
                                        for (i = 0; i < result.length; i++) {
                                            if (result[i].sessionID == SID) {
                                                Qno += `${result[i].id} `
                                                qforSess += `${result[i].question} `


                                            }
                                            lastQno = result[i].id
                                            console.log(lastQno)
                                        }

                                        console.log('questions number: ' + Qno)
                                        console.log(lastQno)
                                        console.log('question: ' + qforSess)
                                        res.status(201).send(JSON.stringify({
                                            id: lastQno,
                                            question: retrieveQ,
                                            session: 'started',
                                        }));

                                    }
                                    else {
                                        res.status(500).send("Error getting questions");
                                        console.log(err)
                                    }
                                })
                            }
                            else {
                                res.status(500).send("Problem storing ids in sql");
                                console.log(err);
                            };
                        });
                    }
                }
                else {
                    console.log(err)
                    res.status(400).send(JSON.stringify({ session: 'not started' }))
                }

            }
        } else {
            console.log(err)
        }

    });

});


// Endpoints for starting/stopping session
app.put("/startsession", function (req, res) {
    console.log('query: ' + req.query);
    const session_id = req.query.sessionid;
    const owner_id = req.query.ownerid;
    const action = req.query.action;


    nanodb.getIDs(function (err, result) {
        console.log('-----------------------')
        // console.log('all sess id: ' + result)
        rows = JSON.stringify(result)
        // console.log(rows)
        console.log('-----------------------')
        if (!err) {
            var wrongid = false;
            var wrongoid = false;
            var tempsessid;
            var tempownid;

            console.log('checking for sessionid validity....')
            console.log('----------------------------------')
            //for loop to check if input for sessid exsist
            for (i = 0; i < result.length; i++) {
                if (result[i].SessionID == session_id) {
                    wrongid = false;
                    tempsessid = result[i].SessionID;
                    console.log('return temp session id: ' + tempsessid)
                    console.log('correct id')
                    break
                }
                else {
                    console.log(result[i].SessionID)
                    wrongid = true;
                    console.log('wrongid')
                }
            }

            console.log('checking for ownerid validity....')
            console.log('----------------------------------')
            //for loop to check if input for ownerid exsist
            for (j = 0; j < result.length; j++) {


                if (result[j].OwnerID == owner_id) {
                    wrongoid = false;
                    tempownid = result[j].OwnerID;
                    console.log('return temp owner id: ' + tempownid)
                    console.log('correct id')
                    break
                }
                else {
                    console.log(result[j].OwnerID)
                    wrongoid = true;
                    console.log('wrongid')
                }


            }

            if (wrongid) {
                console.log('wrong id given / does not match')
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong SessionID' }));
            }
            else if (wrongoid) {
                console.log('wrong id given / does not match')
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong OwnerID' }));
            }
            else {
                //check if whether its owner
                if (j != i) {

                    console.log("sessionid from sql=: " + result[i].SessionID)
                    console.log(result[i])
                    console.log(result[j])
                    console.log("ownerid from sql: " + result[j].OwnerID)
                    console.log('ownerid object: ' + OwnerID)
                    console.log(OwnerID)
                    console.log('------------------------------')


                    console.log('Sessionid object: ' + sessionsID)
                    console.log(sessionsID)
                    console.log('------------------------------')


                    console.log('You are not a owner')
                    res.status(400).send(JSON.stringify({ Reason: "You're not a owner" }));
                }
                else {
                    //check if whether there is both owner and session id
                    if (!session_id || !owner_id) {
                        console.log('please key in session and owner ID')
                        res.status(400).send("please key in session and owner ID");
                        //check if the session is start or stop
                    } else if (action == "start") {
                        const SessStatus = 1
                        nanodb.updateSessStatus(SessStatus, session_id, function (err, result) {
                            if (!err) {
                                console.log('sending id....')
                                res.status(200).send(JSON.stringify({ Session_ID: tempsessid }));
                            }
                            else {
                                res.status(500).send("Problem storing ids in sql");
                                console.log(err);
                            }
                        })
                    }
                }
            }
        } else {
            res.status(500).send("Error getting questions");
            console.log(err)
        }
    })


});


//Stop
app.put("/stopsession", function (req, res) {
    console.log('query: ' + req.query);
    const session_id = req.query.sessionid;
    const owner_id = req.query.ownerid;
    const action = req.query.action;


    nanodb.getIDs(function (err, result) {
        console.log('-----------------------')
        // console.log('all sess id: ' + result)
        rows = JSON.stringify(result)
        // console.log(rows)
        console.log('-----------------------')
        if (!err) {
            var wrongid = false;
            var wrongoid = false;
            var tempsessid;
            var tempownid;

            console.log('checking for sessionid validity....')
            console.log('----------------------------------')
            //for loop to check if input for sessid exsist
            for (i = 0; i < result.length; i++) {
                if (result[i].SessionID == session_id) {
                    wrongid = false;
                    tempsessid = result[i].SessionID;
                    console.log('return temp session id: ' + tempsessid)
                    console.log('correct id')
                    break
                }
                else {
                    console.log(result[i].SessionID)
                    wrongid = true;
                    console.log('wrongid')
                }
            }

            console.log('checking for ownerid validity....')
            console.log('----------------------------------')
            //for loop to check if input for ownerid exsist
            for (j = 0; j < result.length; j++) {


                if (result[j].OwnerID == owner_id) {
                    wrongoid = false;
                    tempownid = result[j].OwnerID;
                    console.log('return temp owner id: ' + tempownid)
                    console.log('correct id')
                    break
                }
                else {
                    console.log(result[j].OwnerID)
                    wrongoid = true;
                    console.log('wrongid')
                }


            }

            if (wrongid) {
                console.log('wrong id given / does not match')
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong SessionID' }));
            }
            else if (wrongoid) {
                console.log('wrong id given / does not match')
                res.status(400).send(JSON.stringify({ Wrong: 'Wrong OwnerID' }));
            }
            else {
                //check if whether its owner
                if (j != i) {

                    console.log("sessionid from sql=: " + result[i].SessionID)
                    console.log(result[i])
                    console.log(result[j])
                    console.log("ownerid from sql: " + result[j].OwnerID)
                    console.log('ownerid object: ' + OwnerID)
                    console.log(OwnerID)
                    console.log('------------------------------')


                    console.log('Sessionid object: ' + sessionsID)
                    console.log(sessionsID)
                    console.log('------------------------------')


                    console.log('You are not a owner')

                    res.status(400).send(JSON.stringify({ Reason: "You're not a owner" }));
                }
                else {
                    //check if whether there is both owner and session id
                    if (!session_id || !owner_id) {
                        console.log('please key in session and owner ID')
                        res.status(400).send("please key in session and owner ID");
                        //check if the session is start or stop
                    } else if (action == "stop") {
                        const SessStatus = 0
                        nanodb.updateSessStatus(SessStatus, session_id, function (err, result) {
                            if (!err) {
                                console.log('sending id....')
                                res.status(200).send(JSON.stringify({ Session_ID: tempsessid }));
                            }
                            else {
                                res.status(500).send("Problem storing ids in sql");
                                console.log(err);
                            }
                        })
                    }
                }
            }
        } else {
            res.status(500).send("Error getting questions");
            console.log(err)
        }
    })

});


//answer the question
app.put("/ansqns", function (req, res) {
    var sessionid = req.query.sessionid;
    var ownerid = req.query.ownerid;
    var question = req.query.qns;
    var answer = req.query.textarea;
    console.log("sessionID: " + sessionid);
    console.log("ownerid: " + ownerid);
    console.log("question: " + question);
    console.log("answer: " + answer);


    nanodb.getIdForQns(sessionid, ownerid, function (err, result) {
        //if user is not owner/ sessionid and ownerid don't match
        console.log('result for getid for qns: ');
        console.log(result)
        console.log(result[0].OwnerID)
        if (ownerid != result[0].OwnerID) {
            console.log("Invalid/Different ownerID")
            res.status(400).json({ reason: "Invalid/Different ownerID" });
        }
        else {
            //insert answer
            nanodb.storeAnsToQns(answer, question, function (err, result) {
                if (!err) {
                    console.log("Answer posted")
                    console.log(result);
                    res.status(201).send(JSON.stringify({
                        result: "Answer posted",
                        answer: answer,
                        ownerID: ownerid,
                        sessionID: sessionid,
                        question: question,
                    }));
                } else {
                    console.log("Could not post answer" )
                    res.status(500).json({ error: "Could not post answer" });
                    console.log(err);
                }
            });
        }
    })

});





// Start server on port 8080

app.listen(8080, function () {
    console.log('listening on Port 8080');
});
