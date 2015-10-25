var tramtrackerClient = Soap.createClient("http://ws.tramtracker.com.au/pidsservice/pids.asmx?WSDL");

var tramTrackerHeader = {
    "tns:PidsClientHeader": {
        "tns:ClientGuid": "74962629-3626-4097-5243-498797978686",
        "tns:ClientType": "DASHBOARDWIDGET",
        "tns:ClientVersion": "1.0",
        "tns:ClientWebServiceVersion": "6.4.0.0",
        "tns:OSVersion": ""
    }
};

tramtrackerClient.addSoapHeader(tramTrackerHeader);


function updateTrams() {
    var input = {
        "tns:stopNo": "1830",
        "tns:routeNo": "86",
        "tns:lowFloor": false
    };

    try {
        var result = tramtrackerClient.GetNextPredictedRoutesCollection(input);
        var tramData = result.GetNextPredictedRoutesCollectionResult.diffgram.DocumentElement.ToReturn;
    } catch(err) {
        return;
    }
    
    Trams.remove({});

    var foundDistantTram = false;

    tramData.forEach(function(tram){
        var tramIsDistant = (moment(tram.PredictedArrivalDateTime) - moment()) > 30*60*1000;

        if (tramIsDistant) {
            if (foundDistantTram) {
                return;
            }
            foundDistantTram = true;
        }

        Trams.insert({
            "route": tram.RouteNo,
            "vehicleNumber": tram.VehicleNo,
            "hasDisruption": tram.HasDisruption,
            "hasAirConditioning": tram.AirConditioned,
            "arrivalTime": tram.PredictedArrivalDateTime,
        });
    });
}


Meteor.setInterval(updateTrams, 10000);