'use strict'

var debug = true;

var gifApp = {
     tagNames: []
    ,currentTagName: ""
    ,currentButton: ""    //TODO: still unused
    ,data: {}
    ,status: 0
    ,startAt: 0
    ,limit: 10
    ,isMobile: false
    ,gifRegularURL: ""
    ,gifMobileURL: ""
}

function start(){
    if(debug){console.log("let's begin")}
    restoreButtons();
}


//EVENTS --------------------------------------------------------
$(document).ready(function(){
    console.log("document is ready!")

    start();
    
    //Clicked on a tagname button to show gifs
    $(document).on("click", ".action", function(e){
        if(debug) {console.log("EVENT: Clicked on a gif button", this)}
        event.preventDefault();

        gifApp.currentTagName = $(this).attr("data-tagname");
        showMeThegifs(gifApp.currentTagName);
    });

    //Clicked 'Add' to add a new gif tagname
    $("#btn-add").on("click", function(event){
        if(debug) {console.log("EVENT: Clicked on ADD", this)}
        event.preventDefault();
        var newTagNameButton = $("#gif-input").val();
        newTagNameButton = newTagNameButton.trim();
        if(newTagNameButton.length>2){
            addANewButton(newTagNameButton);
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
        sendRequest(gifApp.currentTagName);
    });

});


function togglePlay() {
    //swap the "src" and "data-swap" which effectively toggles the play/pause
    var source = $(this).attr("src");
    $(this).attr("src", $(this).attr("data-swap"));
    $(this).attr("data-swap", source);
}

function showMeThegifs(tagName) {
    if(debug){console.log("Function: showMeTheGifs")}
    initialize();
    sendRequest(tagName);
}

function sendRequest(tagName) {
    if(debug) {console.log("Function: sendRequest")}

    tagName = tagName.replace(' ', '+');
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + tagName + "&api_key=QGiMzQfps4Yv5V60bBIA91Y3h4wL1qOX&rating=g&limit=" + gifApp.limit;
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

    // data.data.forEach(function(gif){
    //     if(debug) {console.log("displaying a gif")}
    //     var imgElement = $("<img>").attr({"src":gif.images.fixed_width_still.url, "data-swap":gif.images.fixed_width.url})
    //             .addClass("gif m-2 border rounded");  //gif.images.fixed_height_small_still.url     gif.images.fixed_height_small.url
    //     $("#gifs").append(imgElement);
    // });

    var startAt = gifApp.startAt;
    var gifs = data.data;
    for( var i = 0; i < 10; i++ ){
        if(debug) {console.log("displaying a gif")}
        var imgElement = $("<img>").attr({"src":gifs[startAt+i].images.fixed_width_still.url, "data-swap":gifs[startAt+i].images.fixed_width.url})
                .addClass("gif m-2 border rounded");  //gif.images.fixed_height_small_still.url     gif.images.fixed_height_small.url
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
    var list = localStorage.getItem("tagNames");
    
    //null is returned if 'tagNames' does not exist, i.e. first run ever
    if(list!=null) {
        $("#btn-gif").empty();
        gifApp.tagNames = JSON.parse(list);
        //loop thru the list and make buttons for each
        gifApp.tagNames.forEach(function(tagName){
            displayAButton(tagName);
        });
        } else {
        console.log("this is the firs time has run, so no list yet")
        return false;
    }
 }

function addANewButton(newTagNameButton) {
    if(debug){console.log("Function: addANewButton", newTagNameButton, gifApp.tagNames)}

    //save the new button into the array then into localstorage
    gifApp.tagNames.push(newTagNameButton);
    localStorage.setItem("tagNames", JSON.stringify(gifApp.tagNames));
    //display the new button
    displayAButton(newTagNameButton);
}

function displayAButton(tagName) {
    var buttonElement = $("<button></button>").addClass("action btn btn-sm btn-outline-primary m-1").attr("data-tagname", tagName).text(tagName);
    $("#btn-gif").append(buttonElement);
}