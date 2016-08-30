export default function sidebarController($scope, $http, $location){
  console.log($scope.currentItem)
  $scope.updateTask = function(newName, id){
    $.put('/api/tasks/edit/' + id, {newName})
    .then(response => {
      if(response.data.success){
        $rootScope.tasks[_.findIndex($rootScope.tasks, {t: {id}})] = response.data.data
      } else {

      }
    })
  }
}
