"use strict"

import angular from 'angular'

import _ from 'lodash'
// the data.data is a redundency from the api wrappers. This is intentional, to prevent mutation of
// the data object to begin with when adding success values
export default function mainController($scope, $http, $location, $rootScope){
  $scope.items = []
  $scope.newItem = ""
  $scope.errorMsg = false
  $rootScope.currentItem = {}
  $scope.name = _user.name || $rootScope.myName

  // pull tasks from server upon loading controller
  var init = function(){
    $http.get('/api/users/tasks')
    .then(response => {
      if(response.data.loggedOut){
        $location.url('/')
      }
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

  $scope.displayTask = function(id){
    $http.get(`/api/tasks/${id}/users`)
    .then(response => {
      if(response.data.success){
        $rootScope.currentItem = response.data.data
        console.log($rootScope.currentItem)
        $scope.originalName = angular.copy($rootScope.currentItem[0].task.name)
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
        $scope.items[_.findIndex($scope.items, {task: {id: id}})] = response.data.data[0]
        if($rootScope.currentItem.length > 0 && $scope.items[_.findIndex($scope.items, {task: {id: id}})].task.id === $rootScope.currentItem[0].task.id)
        console.log(id)
            $scope.displayTask(id)
      } else {
        $scope.items[_.findIndex($scope.items, {task: {id: id}})].does.properties.complete = !status
      }
    })
  }

  $scope.clearError = function(){
    $scope.errorMsg = false
  }

  init()
}
