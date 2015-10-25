Trams = new Meteor.Collection("trams", {
    transform: function (tram) {
        tram.minutesUntilArrival = function () {
            var arrivalTime = moment(tram.arrivalTime);
            var now = moment();

            var millisecondsDifference = arrivalTime - now;
            var minutesDifference = millisecondsDifference / 1000 / 60;

            return minutesDifference.toFixed(0);
        }

        // Where to show the tram on a scale of 0 to 100
        tram.position = function () {
            var maxMinutes = 30;

            // Set max of maxMinutes and min of 0
            var minutesUntilArrival = Math.max(Math.min(tram.minutesUntilArrival(), maxMinutes), 0);

            return 100 - (minutesUntilArrival / maxMinutes * 100);
        }

        return tram;
    }
});