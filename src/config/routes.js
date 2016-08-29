export default function routing($routeProvider){
  $routeProvider.when('/', {
    template: require('../templates/index.html')
  })
}
