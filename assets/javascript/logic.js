var audio = document.createElement("audio");
audio.src = "assets/audio/choochoo.mp3";
audio.volume = 0.1;
audio.autoPlay = false;
audio.preLoad = true;
audio.controls = true;




//initialize firebase
var config = {
    apiKey: "AIzaSyAwLSqRWAglDJBlKaduC6k4hnXT7JN0rIY",
    authDomain: "train-scheduling-app-c466e.firebaseapp.com",
    databaseURL: "https://train-scheduling-app-c466e.firebaseio.com",
    projectId: "train-scheduling-app-c466e",
    storageBucket: "train-scheduling-app-c466e.appspot.com",
    messagingSenderId: "917447500889"
};

firebase.initializeApp(config);

var database = firebase.database();

//Functions

$("#submitbutton").on("click", function () {
    if ($("#Train-NameInput").val()==="Thomas the Tank Engine")  {
        $("#mymodal").modal ("show");
        audio.play();
        $("#closebutton").on ("click", function () {
            audio.pause();
        })
        $('#mymodal').on('hide.bs.modal', function () {
            $('audio').each(function(){
                this.pause(); // Stop playing, cant seem to get this to work right
                this.currentTime = 0; 
            });

         })
    
    }
})

$("#submitbutton").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#Train-NameInput").val().trim();
    var destination = $("#DestinationInput").val().trim();
    var firstTrain = moment($("#FirstTrainInput").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#FrequencyInput").val().trim(); 
    
    var newTrain = {
        trainName : trainName,
        destination : destination,
        firstTrain : firstTrain,
        frequency : frequency,
    }

    database.ref().push(newTrain);

    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    $("#Train-NameInput").val("");
    $("#DestinationInput").val("");
    $("#FirstTrainInput").val("");
    $("#FrequencyInput").val("");
})

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var dataName = childSnapshot.val().trainName;
    var dataDest = childSnapshot.val().destination;
    var dataFirst = moment(childSnapshot.val().firstTrain, "HH:mm:a").format("hh:mm:a");
    var dataFreq = moment(childSnapshot.val().frequency, "mm").format("mm");

    console.log(dataName);
    console.log(dataDest);
    console.log(dataFirst);
    console.log(dataFreq);
    console.log(moment()) 

   
    console.log("the first start time is "+ dataFirst);
    
    var diffTime = moment().diff(moment(dataFirst), "minutes");
    console.log("this is the number of minutes between now and the start time"+ diffTime)

    var tRemainder =  diffTime % dataFreq;
    console.log("this is the remainder of minutes between the difference and the frequency" + tRemainder)

    var tMinutesToTrain = dataFreq - tRemainder;
    console.log("this is the time to the train arrives" + tMinutesToTrain)

    var nextTrain = moment().add(tMinutesToTrain, "minutes")
    console.log("this is the number of minutes till the train arrives" + nextTrain)
    

    var htmlinsert = "<tr class datainsert>" + 
                        "<td>"+dataName+"<td>"+
                        "<td>"+dataDest+"<td>"
                        "<td>"+dataFreq+"<td>"
                        "<td>"+nextTrain+"<td>"
                        "<td>"+tMinutesToTrain+"<td>"
                        "<tr>"
    $("#datagoeshere").append(htmlinsert);
    
})






 