export default function signupController($scope, $http){
  $scope.email = ""
  $scope.password = ""
  $scope.name = ""

  $scope.signup = function(){
    $http.post('/auth/signup', {name: $scope.name, email: $scope.email, password: $scope.password})
    .then(response => {
      $scope.email = "" 
      $scope.password = ""
      $scope.name = ""
      console.log(response)
    })
  }
}
