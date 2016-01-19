var app = angular.module('trackerApp', []);

app.controller('tracker', function($scope, $http) {
	
	$scope.totalIssuesRecvd = 0;
	$scope.totalIssues = 0;
	$scope.issues = [];
	$scope.lastDay = [];
	$scope.lastWeek = [];
	$scope.morethanWeek = [];
	
	$scope.rightNow = new Date();

	$scope.getNumberOfIssues = function(){
		
		$scope.totalIssues = 0;
		$scope.totalIssuesRecvd = 0;
		$scope.issues = [];
		$scope.lastDay = [];
		$scope.lastWeek = [];
		$scope.morethanWeek = [];
		
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
			for(i=0;i<=parseInt(response.data/100);i++){
				$scope.getIssues(i+1);
			}
			
		});
		
	};

	$scope.getIssues = function(pageNumber){

		$scope.totalIssuesRecvd = 0;

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
	
	$scope.getIssuesByDate = function(){
		
		$scope.lastDay = [];
		$scope.lastWeek = [];
		$scope.morethanWeek = [];
		
		for(i=0;i<$scope.issues.length;i++){
			if(new Date($scope.issues[i].created_at)>new Date($scope.rightNow.getTime()-86400000)){
				$scope.lastDay.push($scope.issues[i]);
			}
			else if(new Date($scope.issues[i].created_at)>new Date($scope.rightNow.getTime()-7*86400000)){
				$scope.lastWeek.push($scope.issues[i]);
			}
			else{
				$scope.morethanWeek.push($scope.issues[i]);
			}
		}
		
	}

});