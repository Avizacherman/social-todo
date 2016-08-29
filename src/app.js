import angular from 'angular'
import ngRoute from 'angular-route'

import loginController from './controllers/loginController'
import signupController from './controllers/signupController'
import logoutController from './controllers/logoutController'

import routes from './config/routes'

const app = angular.module('SoToDo', [ngRoute])

app
.config(routes)
.controller('loginController', loginController)
.controller('signupController', signupController)
.controller('logoutController', logoutController)
