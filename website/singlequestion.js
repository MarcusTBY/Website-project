window.addEventListener('load', (event) => {

    console.log('page is fully loaded');


    const queryString = window.location.search;


    console.log('Qstring: ' + queryString);


    const urlParams = new URLSearchParams(queryString);

    console.log('uparams: ' + urlParams);

    const qnsquery = urlParams.get('qns');

    const sessionid = urlParams.get('sessionid');

    console.log('sessid: ' + sessionid);
    console.log('question: ' + qnsquery);

    const displaysess = document.getElementById('session');
    const displayqns = document.getElementById('questiontoanswer');

    displaysess.innerHTML = sessionid;
    displayqns.innerHTML = qnsquery;

    const owneridexsist = localStorage.getItem('OwnerID')

    const answer = document.getElementById('textarea')

    const submitbtn = document.getElementById('send-button')

    if(owneridexsist == ''){
        submitbtn.style.display = 'none'
        answer.style.display = 'none';
        console.log('Cant see box: You are not the Owner!');
    }
    else if (owneridexsist){
        submitbtn.style.display = 'block'
        answer.style.display = 'block';
    }


    const AnswerQns = document.getElementById('create');

    // Adding an event listener on createSessionButton for the "Click" event
    AnswerQns.addEventListener('click', function () {
        // This callback function is executed when the event is fired
        alert('Created');

        const answer = document.getElementById('textarea')

        const answerv = answer.value;


        console.log(answerv)
        fetch(`http://localhost:8080/ansqns?sessionid=${sessionid}&qns=${qnsquery}&textarea=${answerv}&ownerid=${owneridexsist}`, { method: 'PUT' })
            // first .then, receive the response
            .then(function (response) {
                console.log(response);
                // Treat the body as json and convert it into JavaScript Object
                return response.json();
            })
            // second .then, where we can access the JavaScript Object
            .then(function (json) {

                console.log('json: ' + json)
                console.log(json.answer)
                if (json.answer == '') {
                    alert('you cannot send empty Answers!')
                }
                else if (json.ownerID == '') {
                    console.log(json.ownerID)
                }
                else {
                    // extract the session Id from response body


                    if (json.question == qnsquery) {
                        // console.log(json);
                        console.log(json.answer)
                        const Qans = json.answer;
                        const questioninput = json.question;

                        console.log('answer input: ' + Qans)
                        console.log('question input: ' + questioninput)

                        alert('You have Answered the Qns!')
                        submitbtn.style.display = 'none'
                        answer.style.display = 'none';
                        // Get reference to the element that will display the session id    
                        const ansreplied = document.getElementById('replied');



                        // Set the innerHTML to the session id
                        ansreplied.innerHTML +=
                            `
                            <div id="ansdisplay">
                        <span id="anstext">${Qans}</span>
                            </div>
                            `


                    }
                    else {
                        console.log(json);
                        alert(`unable to post Ans
                        Reason: Question is not for this page!`)
                    }
                }
            });

    });

});



const goback = document.getElementById('back')

goback.addEventListener('click', function () {
    window.location.replace(`question.html?${sessionid}`)
})
