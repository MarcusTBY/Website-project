window.addEventListener('load', (event) => {
    console.log('page is fully loaded');



    // Getting a reference of the button using document.getElementById(...)
    const goto = document.getElementById('go-button');

    

    // Adding an event listener on createSessionButton for the "Click" event
    goto.addEventListener('click', function () {
        // This callback function is executed when the event is fired

        // alert('Button pressed!');

        const loader = document.getElementById('feedbackani');

        loader.style.display = "block";

        const input = document.getElementById('input')

        const inputv = input.value;

        console.log(inputv)

        const url = `http://localhost:8080/go?input=${inputv}`
        fetch(url, { method: 'GET' })

            // window.location.replace("question.html");


            .then(function (response) {
                // Treat the body as json and convert it into JavaScript Object
                return response.json()
            })
            // second .then, where we can access the JavaScript Object
            .then(function (json) {

                if (inputv == json.Session_ID) {
                    console.log('ID is: ' + json.Session_ID);

                    console.log(json);
                    window.location.replace(`question.html?sessionid=${inputv}`);
                }
                else{
                    console.log(json);
                    alert('wrong session ID');
                    loader.style.display = "none";
                }
                    
                
            })
    });







});

