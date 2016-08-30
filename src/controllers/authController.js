export default function authController($scope, $http, $location){
  $scope.signupEmail = ""
  $scope.signupPassword = ""
  $scope.signupName = ""

  $scope.signup = function(){
    $http.post('/auth/signup', {name: $scope.signupName, email: $scope.signupEmail, password: $scope.signupPassword})
    .then(response => {
      $scope.signupEmail = ""
      $scope.signupPassword = ""
      $scope.signupName = ""
      $scope.signupError = false

      if(response.data.success)
        $location.url('/app')
      else
        $scope.signupError = true
    })
  }

  $scope.loginEmail = ""
  $scope.loginPassword = ""

  $scope.login = function(){
    $http.post('/auth/login', {email: $scope.loginEmail, password: $scope.loginPassword})
    .then(response => {
      $scope.loginEmail = ""
      $scope.loginPassword = ""
      $scope.loginError = false

      if(response.data.success)
        $location.url('/app')
      else
        $scope.signupError = true
    })
  }
}
