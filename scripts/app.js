//utilityModule would norammly sit in a seperate file, but due to the size of the project it is fine in the same file.  
var utilityModule = angular.module("Utilities", []); //Utility module for common funcitons

utilityModule.factory("UtilityFactory", function () {
    var utils = {};
    utils.root = (typeof exports === 'undefined' ? window : exports);
    utils.isRetina = function () {
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

        if (utils.root.devicePixelRatio > 1) {
            return true;
        }

        if (utils.root.matchMedia && utils.root.matchMedia(mediaQuery).matches) {
            return true;
        }

        return false;
    }
    utils.getRetina = function(url){
        //this would normally be a lookup for the retina img
        return 'http://dsx.weather.com/util/image/w/68a62f4e-122e-4c72-91b2-ec9f5024e031.jpg?api=7db9fe61-7414-47b5-9871-e17d87b8b6a0&h=598&w=640&v=at';
    }
    return utils;
});


//main app module gets injected with Utilities Module
var weatherChannelApp = weatherChannelApp || angular.module('WeatherChannelApp', ['Utilities']);

//the factory would also prob be a sperate file in a normal applicaiton
weatherChannelApp.factory('WeatherChannelFactory', ['UtilityFactory', function (UtilityFactory) {
    var appFactory = {};

    appFactory.getImage = function (url) {
        if(UtilityFactory.isRetina()){
            url = UtilityFactory.getRetina(url); 
        }   
        return url;
    };
    appFactory.getSections = function () {
        //normaly a service call to get your data which would do the getRetina piece already, but we still want the methods avaialble in case we need to call on the fly at some point.
        return {
            section1: {
                header: "Basic Document",
                imgUrl: this.getImage('http://dsx.weather.com/util/image/w/68a62f4e-122e-4c72-91b2-ec9f5024e031.jpg?v=at&w=320&h=180&api=7db9fe61-7414-47b5-9871-e17d87b8b6a0')
            },
            section2: {
                header: "Bacon ipsum dolor amet short loin meatloaf spare ribs sausage.",
                content: "Bresaola ball tip meatloaf, jerky brisket pancetta picanha pig biltong pork belly. Leberkas alcatra sausage venison shoulder shank tri-tip landjaeger porchetta. Ham bresaola short ribs chuck. Ball tip pork chop frankfurter doner turkey, porchetta pork belly."
            },
            section3: {
                header: "Shankle sausage pancetta",
                content: "Short loin pork chop turducken ham hock swine ground round bresaola venison pig frankfurter cow meatloaf t-bone picanha brisket. Chicken alcatra chuck, andouille pork belly jowl ribeye."
            }
        }
    };
    appFactory.getFooter = function () {
        return {
            header: "Instructions",
            listItems: [
                { content: 'Using RWD (Responsive Web Design) techniques and the compass breakpoint mixin, show the sections vertically (one above the other) if the display is a handheld or tablet device, but side-by-side with equal widths for desktop user agents.' },
                { content: 'Using SASS write a cross browser gradient mixin and use it to apply different gradients to each section.' },
                { content: 'Use http://dsx.weather.com/util/<wbr>image/w/68a62f4e-122e-4c72-<wbr>91b2-ec9f5024e031.jpg?api=<wbr>7db9fe61-7414-47b5-9871-<wbr>e17d87b8b6a0&amp;h=598&amp;w=640&amp;v=at as the image if the device viewing the page is a Retina display.' },
                { content: 'Set this page up as an Angular app. Manually initialize the app before the closing body tag.' },
                { content: 'Create an angular directive with an interactive element that makes a simple change to the the presentation. For example, click a button and change the background color. Load the directive template from $templateCache. Feel free to be creative or even silly.' },
                { content: '* Bonus question: Create a factory and use it in your directive to calculate the area of the directive element. Display the result of the calculation.' },
            ]
        }
    };
    appFactory.getArea = function (element) {
        var area = element[0].clientHeight * element[0].clientWidth;
        return area;
    };

    return appFactory;
}]);

weatherChannelApp.controller('WeatherChannelController', ['$scope', 'WeatherChannelFactory', function ($scope, WeatherChannelFactory) {
    $scope.sections = WeatherChannelFactory.getSections();
    $scope.footer = WeatherChannelFactory.getFooter();
    $scope.badState = 0;
}]);

weatherChannelApp.directive('customFooter', function () {
    return {
        restrict: 'E',
        templateUrl: '../views/instructions.html'
    };
});

weatherChannelApp.directive('dontTouch', ['WeatherChannelFactory', function(WeatherChannelFactory){
    function link(scope, element, attrs) {
        element.on('click', function () {
            if (scope.badState == 0) {
                scope.directiveArea = WeatherChannelFactory.getArea(element);
                TweenMax.to('.col', 2, { rotation: 180 }); //using thirdparty library inside directive
                element.text("Fix what you just broke and the area is: " + scope.directiveArea);
                scope.badState = 1;
            }
            else {
                scope.directiveArea = WeatherChannelFactory.getArea(element);
                TweenMax.to('.col', 2, { rotation: 0 });  //using thirdparty library inside directive
                element.text("Don't click me and the area is: " + scope.directiveArea);
                scope.badState = 0;
            }
            scope.$apply();
        });
    };
    return {
        restrict: 'A',
        link : link
    }
}]);

angular.bootstrap(document, ['WeatherChannelApp']); //manually bootstrap angular