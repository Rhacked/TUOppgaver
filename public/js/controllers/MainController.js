// public/js/controllers/MainController.js

/**
*Hovedkontroller for hele web-applikasjonen ===========================================================================================================================================================
*/

angular.module('MainCtrl', []).controller('MainController', function($scope, $http, $cacheFactory){
    $scope.forecasts = {};
    $scope.steder = {};
    $scope.today = new Date().getDate();
    $scope.dataloaded = false;
    $scope.vaer = 'Søk på vær!';
    
    /*
    *Setter variabelen $scope.steder, slik at den kan hentes i viewet
    *@data  data som skal bindes til variabelen $scope.steder
    */
    setSteder = function(data){
        $scope.steder = data;
    };
    
    /*
    *Sjekker om en gitt dato er den samme som datoen i dag. Brukes for å kun vise dagens vær i viewet. Set til å returnere true hvis man vil vise absolutt alle værmeldinger som ligger i xml'en
    *Known bug: Sjekker kun om dagen i måneden er den samme. For å være 100% burde den også sjekke om måneden og året er det samme.
    *@date  datoen som sendes inn for å sjekkes
    */
    $scope.checkDate = function(date){
        var inDate = new Date(date);
        var today = new Date();
        if(inDate.getDate() == today.getDate()){
            return true;
        }
        return false;
    };
    
    /*
    *Sjekker om værdataen er lastet inn. Brukes for å vise tabeller som inneholder dataen.
    */
    $scope.dataLoaded = function(){
        return dataloaded;
    }
    
    /*
    *Brukes som en datakontrollfunksjon. Kalles hver gang det hentes data om vær på en spesifikk lokasjon og setter flere variable der etter.
    *@data  json som sendes fra serveren om været. Splittes opp i flere deler slik at de kan brukes i viewet
    */
    setForecast = function(data){
        $scope.forecast = data;
        $scope.text = data.forecast[0].text[0].location[0].time;
        $scope.tabular = data.forecast[0].tabular[0].time;
        $scope.dataloaded=true;
        $scope.vaer = 'Viser vær for';
        $scope.steder = {};
        
    };
    
    
    /*
    *Søkefunksjon som henter brukerinput og sender en GET-request til serveren og etterspør informasjon om steder.
    */
    $scope.search = function(){
        $scope.text = {};
        $scope.tabular = {};
        $scope.dataloaded = false;
        $http.get('/api/steder', {params: {userinput : $scope.userinput}, cache: true})
            .success(function(data){
                if(data.length>=1){
                    setSteder(data);
                    getCache();
                    
                } else {
                    $scope.error = 'Vi fant ingen treff på '+$scope.userinput;
                }
        });
    };
    
    /*
    *Sender en GET-request til serveren som etterspør en oversettelse av xml'en som spesifiseres i argumentet
    *@xmlURL    URL til den spesifiserte XML-filen
    */
    $scope.getWeather = function(xmlURL){
        $scope.xmlURL = xmlURL;
        $http.get('/api/forecast', {params: {URL: xmlURL}, cache: true})
            .success(function(data){
                setForecast(data);
                setSteder();
        });
    };
});