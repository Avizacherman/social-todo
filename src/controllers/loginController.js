export default function loginController($scope, $http){
  $scope.email = ""
  $scope.password = ""

  $scope.login = function(){
    $http.post('/auth/login', {email: $scope.email, password: $scope.password})
    .then(response => {
      $scope.email = ""
      $scope.password = ""
      console.log(response)
    })
  }
}
