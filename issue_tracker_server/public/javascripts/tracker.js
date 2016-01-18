var app = angular.module('trackerApp', []);

app.controller('tracker', function($scope, $http) {

	$scope.getNumberOfIssues = function(){
		
		$scope.page = 1;
		$scope.per_page = 1;
		$scope.state = 'all';
		$scope.input_link = $scope.link;
		$scope.api_link = "https://api.github.com/repos"+$scope.input_link.split("github.com")[1]+"/issues"
		$scope.user = $scope.input_link.split("github.com/")[1].split("/")[0]
		
		$scope.api_query = {

			'link' : $scope.api_link,
			'page' : $scope.page,
			'per_page' : $scope.per_page,
			'state' : $scope.state,
			'user' : $scope.user

		};

		$http.post('/getNumberOfIssues', $scope.api_query).then(function(response){
			$scope.totalIssues = response.data;
			for(i=0;i<=parseInt(response.data)/100;i++){
				$scope.getIssues(i+1);
			}
		});
		
	};

	$scope.getIssues = function(pageNumber){

		$scope.issues = [];
		$scope.page = 1;
		$scope.per_page = 100;
		$scope.state = 'all';
		$scope.totalNumberOfTweets = pageNumber;
		$scope.input_link = $scope.link;
		$scope.api_link = "https://api.github.com/repos"+$scope.input_link.split("github.com")[1]+"/issues"
		$scope.user = $scope.input_link.split("github.com/")[1].split("/")[0]
		
		$scope.api_query = {

			'link' : $scope.api_link,
			'page' : $scope.totalNumberOfTweets,
			'per_page' : $scope.per_page,
			'state' : $scope.state,
			'user' : $scope.user,
			'totalNumberOfTweets' : $scope.totalNumberOfTweets

		};

			$http.post('/getIssues', $scope.api_query).then(function(response){
				$scope.issues = $scope.issues.concat(response.data);
				$scope.totalIssuesRecvd = $scope.issues.length;
			});

	};

});