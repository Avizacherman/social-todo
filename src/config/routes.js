export default function routing($routeProvider){
  $routeProvider
  .when('/', {
    template: require('../templates/auth.html'),
    controller: 'authController'
  })
  .when('/app', {
    template: require('../templates/main.html'),
    controller: 'mainController'
  })
  .when('/app/user/:userid', {
    template: require('../templates/otherUser.html'),
    controller: 'otherUserMainController'
  })
}
