export default function mainController($scope, $http, $location, $rootScope){
  $scope.tasks = []
  $rootScope.currentTask = {}

  // pull tasks from server upon loading controller
  var loadTasks = function(){
    $http.get('/api/users/tasks')
    .then(data => {
      console.log(data)
    })
  }

  loadTasks()
}
