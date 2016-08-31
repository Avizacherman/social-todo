export default function authController($scope, $http, $location, $rootScope){
  function init(){
    if(_userid){
      $location.url('/app')
    }
  }

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

      if(response.data.success){
        $rootScope.myId = response.data.user.id
        $location.url('/app')
      }
      else
        $scope.signupError = true
    })
  }

  $scope.loginEmail = ""
  $scope.loginPassword = ""

  $scope.login = function(){
    $http.post('/auth/login', {email: $scope.loginEmail, password: $scope.loginPassword})
    .then(response => {
      console.log(response)
      $scope.loginEmail = ""
      $scope.loginPassword = ""
      $scope.loginError = false
      if(response.data.success){
        $rootScope.myId = response.data.user.id
        $location.url('/app')
      }
      else
        $scope.loginError = true
    })
  }
  
  init()
}
