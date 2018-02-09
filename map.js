// Put your zillow.com API key here
var zwsid = "X1-ZWz18zcfhbzi17_7aoby";
var geocoder;
var map;
var request = new XMLHttpRequest();

var address;
var markers=[];
var value=0;
var addrlist=[];

function initialize () 
{	
	geocoder=new google.maps.Geocoder;
    var ltlng = new google.maps.LatLng(32.75, -97.13);
    var mapOptions = { zoom: 17, center: ltlng };
	
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
	google.maps.event.addListener(map, 'click', function(event) 
	{geocodePlaceId(map, event.latLng);		});	
}


function geocodePlaceId(map, location) 
{
	clearmarker();
	geocoder=new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({position: location, map: map  });
	markers.push(marker);
	
    var placeId = {lat:location.lat(), lng:location.lng()};
	
    geocoder.geocode({'location': placeId}, function(results, status) 
	{
		if (status === 'OK') 
		{
		  if (results[0]) 
		  {
			var addr=results[0].formatted_address;
			var message = document.getElementById("message");
			var address =addr;
			message.innerHTML=" ";
			request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+""+"+"+""+"+"+"");
			request.withCredentials = "true";
			request.send(null);
			request.onreadystatechange = function(){
			if(request.readyState == 4)
			{	try
				{
					var xml = request.responseXML.documentElement;
					value ="$"+xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
				}
				catch(TypeError)
				{	value="Undefined";
					message.innerHTML="Undefined Location Error";}
				if(value=="")
					value="Not listed in Zillow";
				document.getElementById("output").innerHTML = value;
				
				infowindow.setContent(addr+ " " + value);
				infowindow.open(map, marker);
				addrlist+=addr+" "+value+"<br>";
				document.getElementById("history").innerHTML=addrlist;
			}
			};
			
		  } else {
			window.alert('No results found');
		  }
		} else {
		  window.alert('Geocoder failed due to: ' + status);}
	});
}

function clearmarker()
{
	setMapOnAll(null);
}
function setMapOnAll(map) 
{   for (var i = 0; i < markers.length; i++) 
	{          markers[i].setMap(map);        }
}

function displayResult () {
    if (request.readyState == 4) 
	{
		var infowindow = new google.maps.InfoWindow;
		clearmarker();
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
		
		document.getElementById("output").innerHTML = value;
		
		var address = document.getElementById('address').value;
				
		geocoder.geocode( { 'address': address}, function(results, status) 
		{
			if (status == 'OK') {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({  map: map,position: results[0].geometry.location});
			markers.push(marker);
			infowindow.setContent(address+ " $"+value);
			infowindow.open(map, marker);
			addrlist+=address+" $"+value+"<br>";
			document.getElementById("history").innerHTML=addrlist;
			
			}
			else { alert('Geocode was not successful for the following reason: ' + status); 	}
		});
	}
}
  
function sendRequest () {
    request.onreadystatechange = displayResult;
    var address = document.getElementById("address").value;
    
	
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+""+"+"+""+"+"+"");
    request.withCredentials = "true";
    request.send(null);
}

function cl()
{
	
	document.getElementById("address").value=" ";
	
}
