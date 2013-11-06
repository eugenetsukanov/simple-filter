jQuery('document').ready(function($) {

    var mapOptions, map,
        markersArray = [];

    // show map
    mapOptions = {
        center: new google.maps.LatLng(55.660058, 12.521015),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    // MarkerModel
    var MarkerModel = function(obj) {
        var self = this;
        self.markerAddress = obj.address1;
        self.price = obj.price;
        self.builtYear = obj.builtYear;
        self.propertySizeAdvertized = obj.propertySizeAdvertized;
        self.totalNumberOfRooms = obj.totalNumberOfRooms;
        self.zipCode = obj.zipCode.zipCodeId;

        // show marker on google map
        self.showMarkers = ko.computed(function() {
            var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(obj.latLon.lat, obj.latLon.lon),
                  map: map,
                  title: obj.address1
            });
            markersArray.push(marker);
            self.mI = markersArray.length - 1;
        });


    };

    // BoligModel
    var BoligModel = function(data) {

        var self = this;

        // create markers array
        self.markersData = ko.observableArray([]);

        // push markers data
        $.each(data, function(i, obj) {
            self.markersData.push(new MarkerModel(obj))
        });

        self.selectedMarker = ko.observable();

        // showMarkerInfo
        self.showMarkerInfo = ko.computed(function() {
            if(self.selectedMarker()) {
                for (i in markersArray) {
                    markersArray[i].setMap(null);
                }
                markersArray[self.selectedMarker().mI].setMap(map);
            }
            return self.selectedMarker() ? self.selectedMarker() : 'unknown'
        });

        // clear and load new data for link
        self.loadData = function(data, event) {
            self.clearMarkers();
            ko.cleanNode(document.getElementById('markersData'));
            ko.cleanNode(document.getElementById('markersDataYear'));
            ko.cleanNode(document.getElementById('markersDataPrice'));
            ko.cleanNode(document.getElementById('data1'));
            ko.cleanNode(document.getElementById('data2'));
            ko.cleanNode(document.getElementById('data3'));
            getData(event.target.id)
        };

        // clear all markkers
        self.clearMarkers = function() {
            for (i in markersArray) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        };

    };

    function getData(path) {
        $.getJSON('./json/'+ path +'.json', function(data) {
            ko.applyBindings(new BoligModel(data));
        });
    };

    getData('data1');

});
