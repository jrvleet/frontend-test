(function() {
'use strict';

angular.module('app')
	.controller('MainController', MainController);

MainController.$inject = ['Todo', 'State', '$http', '$cookies'];

function MainController(Todo, State, $http, $cookies) {
	var vm = this;
	vm.selState = 'AL';
	vm.isLoggedIn = false;

	// Retrieve all states at start of home.html
	vm.states = State.get()
					 .$promise.then(function (all) {
					 	vm.states = all.res;
					 	vm.statesList = all.res;
					 });
	// Retrieve by state by selecting the abbreviation from drop down list
	vm.stateChanged = function() {
		vm.states = State.get({abbreviation: vm.selState})
						.$promise.then(function (data) {
							vm.states = [data];
						});
	};

	//User Authentication
	vm.login = function(form) {
		var params = {
			"user": form.user.$viewValue,
			"password": form.password.$viewValue
		  };
		$http({
			url: '/login',
			method: 'POST',
			data: params})
		.success(function(data) {
			if (data.result) {
				vm.isLoggedIn = true;
				window.location.href = '#/home';
			} else {
				vm.loginerror = "Incorrect username or password!";
			}
		}).error(function(data) {
			vm.loginerror = "Error in server!";
		});
	};

	//read messages
	vm.readMessages = function() {
		Todo.query()
		 .$promise.then(function (all) {
		 	vm.messages = all;
		 });
	};
	vm.readMessages();

//add message click handler
	vm.addMessage = function() {
		var message = {"phone": vm.newPhone, "message": vm.newMessage};
		$http({
			url: '/write',
			method: 'POST',
			data: message})
		.success(function(data) {})
		.error(function(data) {
			vm.loginerror = "Error in server!";
		});
		//read message again for update
		vm.readMessages();
	  };

}


})();