/**
 * Feel free to explore, or check out the full documentation
 * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-api-tests
 * for details.
 * City 2 example used here is Sydney, feel free to change the lat and lon to any other city. 
 * Fun fact: I have always wanted to do a Singapore vs Sydney weather comparison.
 */

var assert = require('assert');

//Assign the long and lat of your chosen city - Melbourne in this example
var lat = -37.8136; 
var lon = 144.9631;

//Define your authentication credentials
var appId = '5b6f399ac1142ca4d2ff246498afd67b'; //Create an appID @ https://openweathermap.org/ or free weather API services

var options = {
    //Define endpoint URI
    uri: 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&appId='+appId,
    //Define query key and expected data type.
    headers: {
    'Accept': 'application/json'
}
};

//Define expected results using callback function.
function callback (err, response, body){
//Log JSON results from endpoint to Synthetics console.
 console.log("STEP 1: API Response body is:"+JSON.parse(body));

console.log(JSON.parse(body));

console.log("STEP 2: HTTP Response code is "+response.statusCode) 
 if(response.statusCode !='200'){
   console.log("STEP 3: Failed API response")
 }else{

   console.log("STEP 3: valid API response received")
 }
 var info = JSON.parse(body)
 console.log("The timezone for the test is "+info.timezone)

 console.log("Melbourne is expected to have "+info.current.weather[0].description)
 $util.insights.set('weatherType', info.current.weather[0].description)
 $util.insights.set('city', info.timezone)

  if(info.current.weather[0].description === 'clear sky' || info.current.weather[0].description === 'few clouds'){
    $util.insights.set('go_sailing', "true")
 }else{
   $util.insights.set('go_sailing', "false")
 }

 console.log('STEP 4: API test validations completed');
}

//Make GET request, passing in options and callback.
$http.get(options,callback);