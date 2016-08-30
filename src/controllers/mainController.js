import _ from 'lodash'
// the data.data is a redundency from the api wrappers. This is intentional, to prevent mutation of
// the data object to begin with when adding success values
export default function mainController($scope, $http, $location){
  $scope.items = []
  $scope.newItem = ""
  $scope.errorMsg = false
  $scope.currentItem = {}

  // pull tasks from server upon loading controller
  var loadTasks = function(){
    $http.get('/api/users/tasks')
    .then(response => {
      if(response.data.success){
        $scope.errorMsg = false
        $scope.items = response.data.data
      } else {
        $scope.errorMsg = response.data.msg
      }
    })
  }

  $scope.addTask = function(){
    $http.post('/api/tasks', {name: $scope.newItem})
    .then(response => {
      if(response.data.success){
        $scope.newItem = ""
        $scope.items.push(response.data.data)
      } else {
        $scope.errorMsg = response.data.msg
      }
    })
    .catch(err => {

    })
  }

  $scope.displayTask = function(item){
    $http.get(`/api/tasks/${item.task.id}/users`)
    .then(response => {
      if(response.data.success){
        $scope.currentItem = response.data.data
        $scope.viewTaskSidebar = true
      }
      else
        console.log(response.data.msg)
    })
    .catch(err => {
      console.log(err)
    })
  }



  $scope.checkTask = function(status, id){
    // console.log($scope.task[_.findIndex($scope.tasks, {t: {id}})])
    $http.put('/api/tasks/complete/' + status, {taskid: id})
    .then(response => {
      if(response.data.success){
        debugger
        // $scope.task[_.findIndex($scope.tasks, {t: {id}})] = response.data.data
      } else {
      }
    })
  }

  $scope.clearError = function(){
    $scope.errorMsg = false
  }

  loadTasks()
}
