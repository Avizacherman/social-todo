import angular from 'angular'
import ngRoute from 'angular-route'

import authController from './controllers/authController'
import mainController from './controllers/mainController'
import sidebarController from './controllers/sidebarController'
import otherUserMainController from './controllers/otherUserMainController'

import routes from './config/routes'

const app = angular.module('SoToDo', [ngRoute])

app
.config(routes)
.controller('authController', authController)
.controller('mainController', mainController)
.controller('sidebarController', sidebarController)
.controller('otherUserMainController', otherUserMainController)
