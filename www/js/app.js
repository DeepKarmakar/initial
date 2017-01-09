var app = angular.module('mainModule', ['ionic', 'ngMaterial', 'firebase']);

app.run(function() {
      
  var config = {
    apiKey: "AIzaSyBadxTVA_UiffRaqfGnry3DW2QRmBSYqPo",
    authDomain: "worklist-7e3f2.firebaseapp.com",
    databaseURL: "https://worklist-7e3f2.firebaseio.com",
    storageBucket: "worklist-7e3f2.appspot.com",
    messagingSenderId: "202781327400"
  };
  firebase.initializeApp(config);
})
app.config(function($mdThemingProvider) {
               $mdThemingProvider.theme('myTheme') 
                  .primaryPalette('red')
                  .accentPalette('blue')
                  .warnPalette('cyan');
               });


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'AppCtrl'
      }
    }
  })
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/login');
});
