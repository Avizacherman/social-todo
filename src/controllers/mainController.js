// the data.data is a redundency from the api wrappers. This is intentional, to prevent mutation of
// the data object to begin with when adding success values
export default function mainController($scope, $http, $location, $rootScope){
  $scope.tasks = []
  $scope.newTask = ""
  $scope.errorMsg = false
  $rootScope.currentTask = {}

  // pull tasks from server upon loading controller
  var loadTasks = function(){
    $http.get('/api/users/tasks')
    .then(response => {
      if(response.data.success){
        $scope.errorMsg = false
        $scope.tasks = response.data.data
      } else {
        $scope.errorMsg = response.data.msg
      }
    })
  }

  $scope.addTask = function(){
    $http.post('/api/tasks', {name: $scope.newTask})
    .then(response => {
      console.log(response)
      if(response.data.success){
        $scope.newTask = ""
        $scope.tasks.push(response.data.data)
      } else {
        $scope.errorMsg = response.data.msg
      }
    })
    .catch(err => {

    })
  }

  $scope.clearError = function(){
    $scope.errorMsg = false
  }

  loadTasks()
}
