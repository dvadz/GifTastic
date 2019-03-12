'use strict'

var debug = true;

var gifApp = {
     topics: []
    ,currentTopic: ""
    ,currentButton: ""    //TODO: still unused
    ,data: {}
    ,status: 0
    ,startAt: 0
    ,limit: 10
}

function start(){
    if(debug){console.log("let's begin")}
    restoreButtons();
}


//EVENTS --------------------------------------------------------
$(document).ready(function(){
    console.log("document is ready!")

    console.log(document.documentElement.clientWidth);
    start();
    
    //Clicked on a topic button to show gifs
    $(document).on("click", ".action", function(e){
        if(debug) {console.log("EVENT: Clicked on a gif button", this)}
        event.preventDefault();

        gifApp.currentTopic = $(this).attr("data-topic");
        showMeThegifs(gifApp.currentTopic);
    });

    //Clicked 'Add' to add a new topic
    $("#btn-add").on("click", function(event){
        if(debug) {console.log("EVENT: Clicked on ADD", this)}
        event.preventDefault();
        var newTopic = $("#gif-input").val().trim();
        if(newTopic.length>2){
            addANewTopic(newTopic);
        }
        //clear the input
        $("#gif-input").val("");
    });

    //Clicked on a img to toggle play/pause
    $(document).on("click", ".gif", function(){
        if(debug) {console.log("EVENT: Click on an <img>", this)}
        togglePlay.call(this); // used '.call' to pass 'this'
    });


    // TODO: do this functionality
    //Clicked on I'm having fun!(See More)
    $("#btn-see-more").on("click", function(event){
        if(debug) {console.log("EVENT: Clicked on 'I'm having fun", this)}
        event.preventDefault();
        gifApp.startAt += 10;
        gifApp.limit += 10;
        sendRequest(gifApp.currentTopic);
    });

    //React to mobile orientation change
    $(window).on("orientationchange", function(event){
        if(debug){console.log("EVENT: orientation changed", window.orientation)};
        // portrait: 0
        // portrait (upside down): 180 
        // landscape: (counterclockwise): 90
        // landscape: (clockwise): -90
        // if(window.orientation===90 || window.orientation===-90) landscape
    });

    //Clicked on the 'x' icon to delete
    $(document).on("click","#delete", function(){
        if(debug){console.log("EVENT: clicked on trash icon: ", $(this).attr("data-topic"))};
        return false;

    });

});


function togglePlay() {
    //swap the "src" and "data-swap" which effectively toggles the play/pause
    var source = $(this).attr("src");
    $(this).attr("src", $(this).attr("data-swap"));
    $(this).attr("data-swap", source);
}

function showMeThegifs(topic) {
    if(debug){console.log("Function: showMeTheGifs")}
    initialize();
    sendRequest(topic);
}

function sendRequest(topic) {
    if(debug) {console.log("Function: sendRequest")}

    topic = topic.replace(' ', '+');
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=QGiMzQfps4Yv5V60bBIA91Y3h4wL1qOX&rating=g&limit=" + gifApp.limit;
    if(debug) {console.log(queryURL)}

    gifApp.status = 0;
    var xhr = $.get(queryURL);

    xhr.done(function(data) { 
        console.log("success got data", data);
        gifApp.data = data;
        gifApp.status = data.meta.status;
        if(data.meta.msg==="OK" && data.meta.status===200){
            displayGifs(data);
            showSeeMore();
        } else {
            console.log("ERROR during GIPHY API call...");
            hideSeeMore();
        }
    });
}

function displayGifs(data){
    if(debug) {console.log("Function: displayGifs")}

    var startAt = gifApp.startAt,
        gifs = data.data,
        imgElement,
        isSmall = (document.documentElement.clientWidth<400) ? true : false ;

    for( var i = 0; i < 10; i++ ){
        if(debug) {console.log("displaying a gif")}
        if(isSmall) {
            imgElement = $("<img>").attr({"src":gifs[startAt+i].images.fixed_width_small_still.url, "data-swap":gifs[startAt+i].images.fixed_width_small.url})
            .addClass("gif m-2 border rounded");          //gif.images.fixed_height_small_still.url     gif.images.fixed_height_small.url
        } else {
            imgElement = $("<img>").attr({"src":gifs[startAt+i].images.fixed_width_still.url, "data-swap":gifs[startAt+i].images.fixed_width.url})
            .addClass("gif m-2 border rounded");  //gif.images.fixed_height_small_still.url     gif.images.fixed_height_small.url
        } 
        $("#gifs").append(imgElement);
    }
}

function initialize (){
    $("#gifs").empty();
    gifApp.startAt = 0;
    gifApp.limit = 10;
}

// BUTTONS Galore -------------------------------------------------------------
function showSeeMore() {
    $("#btn-see-more").show();
}

function hideSeeMore() {
    $("#btn-see-more").hide();
}

function restoreButtons(){
    if(debug){console.log("Function: restoreButtons")}
    var list = localStorage.getItem("topics");
    
    //null is returned if 'topics' does not exist, i.e. first run ever
    if(list!=null) {
        $("#btn-gif").empty();
        gifApp.topics = JSON.parse(list);
        //make a button for each topic
        gifApp.topics.forEach(function(topic){
            displayAButton(topic);
        });
        } else {
        console.log("there are no topics, please add some")
        return false;
    }
 }

function addANewTopic(newTopic) {
    if(debug){console.log("Function: addANewTopic", newTopic, gifApp.topics)}

    //add new topic into the array then save into localstorage
    saveNewTopicIntoTheList(newTopic);
    storeTopicsToLocalStorage();
     //display the new button
    displayAButton(newTopic);
}

function saveNewTopicIntoTheList(newTopic){
    gifApp.topics.push(newTopic);
}

function storeTopicsToLocalStorage() {
    localStorage.setItem("topics", JSON.stringify(gifApp.topics));
}

function displayAButton(topic) {
    var deleteIcon = $("<span id='delete' >&#9747</span>").attr({"data-topic": topic, "title": "remove this topic"});
    var buttonElement = $("<button></button>").addClass("action btn btn-sm btn-outline-primary m-1")
            .attr("data-topic", topic).text(topic).append(" ", deleteIcon);
    $("#btn-gif").append(buttonElement);
}