(function() {
'use strict';

angular.module('app')
	.factory('Todo', todo);

	Todo.$inject = ['$resource'];

	function Todo($resource) {
		var TodoResource = $resource('/read',{},{});
		return TodoResource;
		
	}

})();