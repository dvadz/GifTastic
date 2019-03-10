'use strict'

var debug = true;

var gifApp = {
     buttonsList: []
    ,buttonPressed: ""
 

}

$(document).ready(function(){
    console.log("document is ready!")

    //Click on buttons to show gifs
    $(document).on("click", ".action", function(){
        if(debug) {console.log("EVENT: Click on", this)}
        this.buttonPressed = $(this).attr("data-name");
        showMeThegifs(this.buttonPressed);
    });
});

function showMeThegifs(name) {
    clear_gifs();
    sendRequest(name);
}

function sendRequest(name) {
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + name + "&api_key=QGiMzQfps4Yv5V60bBIA91Y3h4wL1qOX&limit=10";
    if(debug) {console.log("Function: sendRequest")}

    var xhr = $.get(queryURL);

    xhr.done(function(data) { 
        console.log("success got data", data);
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
        var imgElement = $("<img>").attr("src",gif.images.fixed_height_small.url);
        $("#gifs").append(imgElement);
    });

}

function clear_gifs (){
    gifDiv.empty();
}

function showSeeMore() {

}