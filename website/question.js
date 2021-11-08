
const queryString = window.location.search;

console.log('Qstring: ' + queryString)


const urlParams = new URLSearchParams(queryString);

console.log('uparams: ' + urlParams)


const sessionid = urlParams.get('sessionid')

console.log('sessid: ' + sessionid)

const displaysess = document.getElementById('session');

displaysess.innerHTML = sessionid


window.addEventListener('load', (event) => {

    console.log('page is fully loaded');


    fetch(`http://localhost:8080/getqns?sessionid=${sessionid}`, { method: 'GET' })


        // first .then, receive the response
        .then(function (response) {
            // Treat the body as json and convert it into JavaScript Object
            return response.json();
        })
        // second .then, where we can access the JavaScript Object
        .then(function (json) {

            console.log('json: ' + json)

            // rows = JSON.stringify(json)

            console.log('---------------------')
            console.log(json)
            console.log('is started: ' + json.isStarted)

            const sesscircle = document.getElementById('spanStatus');

            if (json.isStarted == 1) {
                sesscircle.innerHTML = '🟢';
            }
            else {
                sesscircle.innerHTML = '🔴';
            }

            const questionBOX = document.getElementById('question');

            questionBOX.innerHTML = '';

            console.log(json.allqns.length)


            for (i = 0; i < json.allqns.length; i++) {

                // console.log('question is: ');
                // console.log(json.allqns[i]);

                // console.log('========================================');

                // console.log('id is: ');
                // console.log(json.allqnsid[i].id)

                questionBOX.innerHTML +=
                    `
                <div id="display-q-box">
                    <p id="q-ID">#${json.allqnsid[i].id} </p>
                    <p id="display-q">${json.allqns[i].questions}</p>
                    <span><a id="view-button" href="./singlequestion.html?sessionid=${sessionid}&qns=${json.allqns[i].questions}">View 🔍</a></span>
                </div>
                `

            }


        });
});


// Getting a reference of the button using document.getElementById(...)
const CreateQns = document.getElementById('create');

// Adding an event listener on createSessionButton for the "Click" event
CreateQns.addEventListener('click', function () {
    // This callback function is executed when the event is fired
    alert('Created');

    const question = document.getElementById('textarea')

    const questionv = question.value;


    console.log(questionv)
    fetch(`http://localhost:8080/createqns?textarea=${questionv}&sessionid=${sessionid}`, { method: 'POST' })
        // first .then, receive the response
        .then(function (response) {
            console.log(response);
            // Treat the body as json and convert it into JavaScript Object
            return response.json();
        })
        // second .then, where we can access the JavaScript Object
        .then(function (json) {

            console.log('json: ' + json)
            if (json.emptyqns) {
                alert('you cannot send empty qns!')
            }
            else {
                // extract the session Id from response body


                if (json.session == 'started') {
                    console.log(json);
                    console.log(json.id)
                    const QID = json.id;
                    const questioninput = json.question;

                    console.log('question input: ' + questioninput)



                    // Get reference to the element that will display the session id    
                    const questionBOX = document.getElementById('question');



                    // Set the innerHTML to the session id
                    questionBOX.innerHTML +=
                        `
                    <div id="display-q-box">
                        <p id="q-ID">#${QID}</p>
                        <p id="display-q">${questioninput}</p>
                        <span><a id="view-button" href="./singlequestion.html?sessionid=${sessionid}&qns=${questioninput}">View 🔍</a></span>
                    </div>
                    `


                }
                else {
                    console.log(json);
                    alert(`unable to post question
                Reason: Session not Started!`)
                }
            }
        });


    console.log('running second fetch....')
    console.log('----------------------------------------')


    fetch(`http://localhost:8080/getqns?sessionid=${sessionid}`, { method: 'GET' })


        // first .then, receive the response
        .then(function (response) {
            // Treat the body as json and convert it into JavaScript Object
            return response.json();
        })
        // second .then, where we can access the JavaScript Object
        .then(function (json) {

            console.log('json: ' + json)

            // rows = JSON.stringify(json)

            console.log('---------------------')
            console.log(json)

            const questionBOX = document.getElementById('question');

            questionBOX.innerHTML = '';

            console.log(json.allqns.length)


            for (i = 0; i < json.allqns.length; i++) {

                // console.log('question is: ');
                // console.log(json.allqns[i]);

                // console.log('========================================');

                // console.log('id is: ');
                // console.log(json.allqnsid[i].id)

                questionBOX.innerHTML +=
                    `
                <div id="display-q-box">
                    <p id="q-ID">#${json.allqnsid[i].id} </p>
                    <p id="display-q">${json.allqns[i].questions}</p>
                    <span><a id="view-button" href="./singlequestion.html?sessionid=${sessionid}&qns=${json.allqns[i].questions}">View 🔍</a></span>
                </div>
                `
            }
        });
});


const Refresh = document.getElementById('refresh');


Refresh.addEventListener('click', function () {
    // This callback function is executed when the event is fired



    fetch(`http://localhost:8080/getqns?sessionid=${sessionid}`, { method: 'GET' })


        // first .then, receive the response
        .then(function (response) {
            // Treat the body as json and convert it into JavaScript Object
            return response.json();
        })
        // second .then, where we can access the JavaScript Object
        .then(function (json) {

            console.log('json: ' + json)

            // rows = JSON.stringify(json)

            console.log('---------------------')
            console.log(json)

            const questionBOX = document.getElementById('question');

            questionBOX.innerHTML = '';

            console.log(json.allqns.length)


            for (i = 0; i < json.allqns.length; i++) {

                // console.log('question is: ');
                // console.log(json.allqns[i]);

                // console.log('========================================');

                // console.log('id is: ');
                // console.log(json.allqnsid[i].id)

                questionBOX.innerHTML +=
                    `
            <div id="display-q-box">
                <p id="q-ID">#${json.allqnsid[i].id} </p>
                <p id="display-q">${json.allqns[i].questions}</p>
                <span><a id="view-button" href="./singlequestion.html?sessionid=${sessionid}&qns=${json.allqns[i].questions}">View 🔍</a></span>
            </div>
            `
            }
        });
});





const goback = document.getElementById('back')

goback.addEventListener('click', function () {
    window.location.replace("index.html");
    localStorage.clear();
})




