export default function routing($routeProvider){
  $routeProvider
  .when('/', {
    template: require('../templates/index.html'),
    controller: 'authController'
  })
  .when('/app', {
    template: require('../templates/main.html'),
    controller: 'mainController'
  })
}
