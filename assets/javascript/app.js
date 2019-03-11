'use strict'

var debug = true;

var gifApp = {
     buttonNames: []
    ,buttonPressed: ""
    ,data: {}
}

function start(){
    if(debug){console.log("let's begin")}
    restoreButtons();
}


//EVENTS --------------------------------------------------------
$(document).ready(function(){
    console.log("document is ready!")

    start();
    
    //Clicked buttons name to show gifs
    $(document).on("click", ".action", function(e){
        if(debug) {console.log("EVENT: Click on a gif button", this)}
        event.preventDefault();

        this.buttonPressed = $(this).attr("data-name");
        showMeThegifs(this.buttonPressed);
    });

    //Clicked 'Add' a new gif category/name
    $("#btn-add").on("click", function(event){
        if(debug) {console.log("EVENT: Click on ADD", this)}
        event.preventDefault();
        var newButtonName = $("#gif-input").val();
        newButtonName = newButtonName.trim();
        if(newButtonName.length>2){
            addANewButton(newButtonName);
        }
        //clear the input
        $("#gif-input").val("");
    });

    // TODO: do this functionality
    //Clicked on I'm having fun!(See More)
    $("#btn-see-more").on("click", function(event){
        if(debug) {console.log("EVENT: Click on See More", this)}
        event.preventDefault();
    });
});

function showMeThegifs(name) {
    clear_gifs();
    sendRequest(name);
}

function sendRequest(name) {
    name = name.replace(' ', '+');
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + name + "&api_key=QGiMzQfps4Yv5V60bBIA91Y3h4wL1qOX&limit=10";
    if(debug) {console.log("Function: sendRequest")}

    var xhr = $.get(queryURL);

    xhr.done(function(data) { 
        console.log("success got data", data);
        gifApp.data = data;
        if(data.meta.msg==="OK"){
            displayGifs(data);
        } else {
            console.log("ERROR during GIPHY API call...");
        }
    });
}

function displayGifs(data){
    if(debug) {console.log("Function: displayGifs")}

    data.data.forEach(function(gif){
        if(debug) {console.log("displaying a gif")}
        var imgElement = $("<img>").attr("src",gif.images.fixed_height_small.url).addClass("m-2 border rounded");
        $("#gifs").append(imgElement);
    });
}

function clear_gifs (){
    $("#gifs").empty();
}

function showSeeMore() {
    $("#btn-see-more").show();
}

function hideSeeMore() {
    $("#btn-see-more").hide();
}

function restoreButtons(){
    if(debug){console.log("Function: restoreButtons")}
    var list = localStorage.getItem("buttonNames");
    
    //null is returned 'buttonNames' does not exist, i.e. first run ever
    if(list!=null) {
        $("#btn-gif").empty();
        gifApp.buttonNames = JSON.parse(list);
        gifApp.buttonNames.forEach(function(name){
            displayAButton(name);
        });
        } else {
        console.log("this is the firs time has run, so no list yet")
        return false;
    }
 }

function addANewButton(newButtonName) {
    if(debug){console.log("Function: addANewButton", newButtonName, gifApp.buttonNames)}

    //save the new button into the array then into localstorage
    gifApp.buttonNames.push(newButtonName);
    localStorage.setItem("buttonNames", JSON.stringify(gifApp.buttonNames));
    //display the new button
    displayAButton(newButtonName);
}

function displayAButton(name) {
    var buttonElement = $("<button></button>").addClass("action btn btn-sm btn-outline-primary m-1 ").attr("data-name", name).text(name);
    $("#btn-gif").append(buttonElement);
}

