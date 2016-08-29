export default function logoutController($scope, $http){
  $scope.logout = function(){
    $http.post('/auth/logout')
    .then(response => {
      console.log(response)
    })
  }
}
