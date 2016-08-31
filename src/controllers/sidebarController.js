import angular from 'angular'

export default function sidebarController($scope, $http, $location, $rootScope){

  $scope.showInput = function(){
    $scope.editItem = true
  }

  function revert(){
    $rootScope.currentItem[0].task.name = angular.copy($scope.originalName)
    $scope.editItem = false
  }

  $scope.updateTask = function(originalId, newName){
    if(newName != $scope.originalName){
      $http.put('/api/tasks/edit/' + originalId, {newName})
      .then(response => {

        if(response.data.success){
          let {name, id} = response.data.data[0].task
          let taskIndex = _.findIndex($scope.items, {task: {id: originalId}})
          $scope.items[taskIndex].task.name = name
          $scope.items[taskIndex].task.id = id
          $rootScope.currentItem = response.data.data
          $scope.originalName = angular.copy($scope.currentItem[0].task.name)
          $scope.editItem = false
        } else {
          revert()
        }
      })
      .catch(err => {
        revert()
      })
    }
    else
      $scope.editItem = false
  }

  $scope.showUser = function(userid){
    if(userid === $rootScope.myId)
      $location.url(`/app`)    
    else
      $location.url(`/app/user/${userid}`)
  }
}
