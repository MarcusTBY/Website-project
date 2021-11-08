window.addEventListener('load', (event) => {
    console.log('page is fully loaded');



    // Getting a reference of the button using document.getElementById(...)
    const newSessionButton = document.getElementById('new-session');

    // Adding an event listener on createSessionButton for the "Click" event
    newSessionButton.addEventListener('click', function () {
        // This callback function is executed when the event is fired
        // alert('Button pressed!');

        
        const loader = document.getElementById('feedbackani1');

        loader.style.display = "block";

        function anistop() {
            setTimeout(function(){ loader.style.display = "none"}, 1000);
          }

        fetch('http://localhost:8080/idcreate', { method: 'POST' })
            // first .then, receive the response
            .then(function (response) {
                // Treat the body as json and convert it into JavaScript Object
                return response.json();
            })
            // second .then, where we can access the JavaScript Object
            .then(function (json) {

                console.log(json)
                // extract the session Id from response body
                const sessionId = json.session_id;
                const ownerId = json.owner_id;

                // Get reference to the element that will display the session id
                const sessionIdField = document.getElementById('input-s');
                const ownerIdField = document.getElementById('input-o');

                // Set the innerHTML to the session id
                sessionIdField.value = sessionId;
                ownerIdField.value = ownerId;

                anistop()

            });
    });


    //GOTO button fetch
    // Getting a reference of the button using document.getElementById(...)
    const goto = document.getElementById('go-button');

    // Adding an event listener on createSessionButton for the "Click" event
    goto.addEventListener('click', function () {
        // This callback function is executed when the event is fired

        // alert('Button pressed!');

        const loader = document.getElementById('feedbackani4');

        loader.style.display = "block";

        const input = document.getElementById('input-s')

        const inputo = document.getElementById('input-o')

        const inputv = input.value;

        const inputvo = inputo.value;

        console.log(inputv)
        console.log(inputvo)

        const url = `http://localhost:8080/mgo?input=${inputv}&inputo=${inputvo}`
        fetch(url, { method: 'GET' })

            // window.location.replace("question.html");


            .then(function (response) {
                // Treat the body as json and convert it into JavaScript Object
                return response.json()
            })
            // second .then, where we can access the JavaScript Object
            .then(function (json) {
                if (inputv == json.Session_ID && inputvo == json.Owner_ID) {
                    console.log('sessionID is: ' + json.Session_ID);
                    console.log('ownerID is: ' + json.Owner_ID);

                    console.log(json);

                    window.localStorage.setItem("OwnerID", inputvo)
                    window.location.replace(`question.html?sessionid=${inputv}`);
                }
                else {
                    console.log(json);
                    alert('wrong SessionID/OwnerID');

                    loader.style.display = "none";
                }


            })
    });

    //Start session
    const startsess = document.getElementById('start-button')


    startsess.addEventListener('click', function () {

        // alert('starting new session')

        const loader = document.getElementById('feedbackani2');

        loader.style.display = "block";

        const input_for_sess = document.getElementById('input-s')
        const input_for_owner = document.getElementById('input-o')
    
        const input_sess_value = input_for_sess.value;
        const input_owner_value = input_for_owner.value;
    
        console.log('sess value: ' + input_sess_value);
        console.log('owner value: ' + input_owner_value);
    

        url = `http://localhost:8080/startsession?sessionid=${input_sess_value}&ownerid=${input_owner_value}&action=start`
        fetch(url, { method: 'PUT' })

            .then(function (response) {
                // Treat the body as json and convert it into JavaScript Object
                return response.json()
            })
            // second .then, where we can access the JavaScript Object
            .then(function (json) {
                if (input_sess_value == json.Session_ID) {
                    console.log('ID is: ' + json.Session_ID);

                    console.log(json);
                    alert('Session started!')

                    loader.style.display = "none";
                }
                else {
                    console.log(json);
                    alert('wrong session ID');

                    loader.style.display = "none";
                }


            })
    });


    const stopsess = document.getElementById('stop-button')


    stopsess.addEventListener('click', function () {

        // alert('stopping session')

        const loader = document.getElementById('feedbackani3');

        loader.style.display = "block";

        const input_for_sess = document.getElementById('input-s')
        const input_for_owner = document.getElementById('input-o')
    
        const input_sess_value = input_for_sess.value;
        const input_owner_value = input_for_owner.value;
    
        console.log('sess value: ' + input_sess_value);
        console.log('owner value: ' + input_owner_value);
    

        url = `http://localhost:8080/stopsession?sessionid=${input_sess_value}&ownerid=${input_owner_value}&action=stop`
        fetch(url, { method: 'PUT' })

        .then(function (response) {
            // Treat the body as json and convert it into JavaScript Object
            return response.json()
        })
        // second .then, where we can access the JavaScript Object
        .then(function (json) {
            if (input_sess_value == json.Session_ID) {
                console.log('ID is: ' + json.Session_ID);

                console.log(json);
                alert('Session stopped!')


                loader.style.display = "none";
            }
            else {
                console.log(json);
                alert('wrong session ID');


                loader.style.display = "none";
            }


        })
    });


});




