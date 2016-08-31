"use strict"

import angular from 'angular'

import _ from 'lodash'

export default function otherUserMainController($scope, $http, $location, $rootScope, $routeParams){
  $scope.items = []
  $scope.newItem = ""
  $scope.errorMsg = false
  $rootScope.currentItem = {}

  var init = function(){
    $http.get(`/api/users/${$routeParams.userid}/tasks`)
    .then(response => {
      if(response.data.loggedOut){
        $location.url('/')
      }
      if(response.data.success){
        $scope.errorMsg = false
        $scope.items = response.data.data
      } else {
        console.log(response)

        $scope.errorMsg = response.data.msg
      }
    })
  }

  $scope.displayTask = function(id){
    console.log(id)
    $http.get(`/api/users/${$routeParams.userid}/task/${id}/users`)
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


  init()
}
