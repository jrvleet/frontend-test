(function() {
'use strict';

angular.module('app')
	.factory('State', State);

	State.$inject = ['$resource'];

	function State($resource) {
		var StateResource = $resource('/states/:abbreviation', {abbreviation: '@abbreviation'});
		return StateResource;
	}

})();