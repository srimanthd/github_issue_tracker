var app = angular.module('trackerApp', []);
var issuesd = [];

app.controller('tracker', function ($scope, $http) {

	// defining and initialzing variables
	$scope.totalIssuesRecvd = 0;
	$scope.totalIssues = 0;
	$scope.issues = [];
	$scope.lastDay = [];
	$scope.lastWeek = [];
	$scope.morethanWeek = [];
	$scope.retrievalCount = 0;
	$scope.totalPostRequests = 0;
	$scope.retrievalStatus = "Retrieving"
	$scope.rightNow = new Date();

	// function which validates input link
	$scope.validateUrl = function (githublink) {

		var valid = false;

		// checking whether the input link is valid or not
		if (githublink != undefined && githublink != null && githublink != "" && githublink.indexOf('github.com/') != -1) {
			var userAndRepo = githublink.split("github.com/")[1];
			// checking whether both user and repository are present in the link or not
			if (userAndRepo.split("/").length == 2) {
				valid = true;
			}
		}

		return valid;

	}

	// function which gets total number of issues
	$scope.getNumberOfIssues = function () {

		// initially and when the user inputs another link, we will not show any thing except input link field and get issues button
		d3.select("#status").style("display", "None");
		d3.select("#dateButton").style("display", "None");
		d3.select("#filtered").style("display", "None");

		// removing / if it is at the end
		if($scope.link.charAt($scope.link.length-1)=='/'){
		$scope.link = $scope.link.slice(0,$scope.link.length-1)
		}
		
		// if the input link is valid we will request the issues
		if (!$scope.validateUrl($scope.link)) {
			window.alert("Please enter valid gihub repository link");
		} else {
			// if the input link is valid then we will display status table and Get Issues By Date button
			d3.select("#status").style("display", "");
			d3.select("#dateButton").style("display", "");

			// if the user inputs another link we need to initialze the following variables
			$scope.totalIssues = 0;
			$scope.totalIssuesRecvd = 0;
			$scope.totalPostRequests = 0;
			$scope.retrievalCount = 0;
			$scope.issues = [];
			$scope.lastDay = [];
			$scope.lastWeek = [];
			$scope.morethanWeek = [];
			$scope.retrievalStatus = "Retrieving";

			// we will get the latest issue opened by sending page and per_page request parameters as 1
			$scope.page = 1;
			$scope.per_page = 1;
			$scope.state = 'all';
			$scope.input_link = $scope.link;
			$scope.api_link = "https://api.github.com/repos" + $scope.input_link.split("github.com")[1] + "/issues"
				$scope.user = $scope.input_link.split("github.com/")[1].split("/")[0]

				// preparing the github api request query
				$scope.api_query = {

				'link' : $scope.api_link,
				'page' : $scope.page,
				'per_page' : $scope.per_page,
				'state' : $scope.state,
				'user' : $scope.user

			};

			// we will send the request and the reponse recived will be number of issues opened so far
			$http.post('/getNumberOfIssues', $scope.api_query).then(function (response) {
				$scope.totalIssues = response.data;
				if(response.data == "No issues or repository does not exist"){
					$scope.retrievalStatus = "Done";
					$scope.totalIssuesRecvd = 0;
				}
				// at a time github api only returns 100 issues, so we have send post requests with increasing page parameter
				$scope.totalPostRequests = parseInt(response.data / 100) + 1;
				for (i = 0; i <= parseInt(response.data / 100); i++) {
					// calling getIssues function with page parameter argument
					$scope.getIssues(i + 1);
				}

			});
		}

	};

	// function which gets all the issues
	$scope.getIssues = function (pageNumber) {

		// defining request parameters
		$scope.totalIssuesRecvd = 0;
		$scope.page = 1;
		$scope.per_page = 100;
		$scope.state = 'all';
		$scope.totalNumberOfTweets = pageNumber;
		$scope.input_link = $scope.link;
		$scope.api_link = "https://api.github.com/repos" + $scope.input_link.split("github.com")[1] + "/issues"
			$scope.user = $scope.input_link.split("github.com/")[1].split("/")[0]

			// preparing github api request query
			$scope.api_query = {

			'link' : $scope.api_link,
			'page' : $scope.totalNumberOfTweets,
			'per_page' : $scope.per_page, // page number is the main request parameter which increments per every request//
			'state' : $scope.state,
			'user' : $scope.user,
			'totalNumberOfTweets' : $scope.totalNumberOfTweets

		};

		// sending the requst with incremental page value
		$http.post('/getIssues', $scope.api_query).then(function (response) {
			$scope.retrievalCount++;
			if ($scope.retrievalCount == $scope.totalPostRequests) {
				// if the total page numbers reaches limit i.e no more issues are present
				$scope.retrievalStatus = "Done"
			}
			// append json (array) response to issues array which holds all the issues
			$scope.issues = $scope.issues.concat(response.data);
			issuesd = $scope.issues;
			$scope.totalIssuesRecvd = $scope.issues.length;
		});

	};

	// function which filters issues in various ways
	$scope.getIssuesByDate = function () {

		d3.select("#filtered").style("display", "");
		
		doLastDay = new Date($scope.rightNow.getTime() - 86400000)
		doLastWeek = new Date($scope.rightNow.getTime() - 7 * 86400000)
		
		$scope.openActualIssues = $scope.issues.filter(function(e){ return (e.state=='open'&&e.pull_request==undefined) })
		$scope.closedActualIssues = $scope.issues.filter(function(e){ return (e.state=='closed'&&e.pull_request==undefined) })
		$scope.openPullRequests = $scope.issues.filter(function(e){ return (e.state=='open'&&e.pull_request!=undefined) })
		$scope.closedPullRequests = $scope.issues.filter(function(e){ return (e.state=='closed'&&e.pull_request!=undefined) })
		$scope.actualIssues = $scope.issues.filter(function(e){ return e.pull_request==undefined })
		$scope.pullRequests = $scope.issues.filter(function(e){ return e.pull_request!=undefined })
		$scope.totalOpenIssues = $scope.issues.filter(function(e){ return e.state=='open' })
		$scope.totalClosedIssues = $scope.issues.filter(function(e){ return e.state=='closed' })

		$scope.lastDay = $scope.totalOpenIssues.filter(function(e){ return new Date(e.created_at)>doLastDay })
		$scope.lastWeek = $scope.totalOpenIssues.filter(function(e){ return new Date(e.created_at)>doLastWeek })
		$scope.morethanWeek = $scope.totalOpenIssues.filter(function(e){ 
												return (new Date(e.created_at)<=doLastDay && new Date(e.created_at)<=doLastWeek ) 
											});
		
		$scope.lastDay_wo_pull = $scope.openActualIssues.filter(function(e){ return new Date(e.created_at)>doLastDay })
		$scope.lastWeek_wo_pull = $scope.openActualIssues.filter(function(e){ return new Date(e.created_at)>doLastWeek })
		$scope.morethanWeek_wo_pull = $scope.openActualIssues.filter(function(e){ 
												return (new Date(e.created_at)<=doLastDay && new Date(e.created_at)<=doLastWeek )
											});
		
		$scope.lastDay_pull = $scope.openPullRequests.filter(function(e){ return new Date(e.created_at)>doLastDay })
		$scope.lastWeek_pull = $scope.openPullRequests.filter(function(e){ return new Date(e.created_at)>doLastWeek })
		$scope.morethanWeek_pull = $scope.openPullRequests.filter(function(e){ 
												return (new Date(e.created_at)<=doLastDay && new Date(e.created_at)<=doLastWeek )
											});

		$scope.lastDay_closed = $scope.totalOpenIssues.filter(function(e){ return new Date(e.created_at)>doLastDay })
		$scope.lastWeek_closed = $scope.totalOpenIssues.filter(function(e){ return new Date(e.created_at)>doLastWeek })
		$scope.morethanWeek_closed = $scope.totalOpenIssues.filter(function(e){ 
												return (new Date(e.created_at)<=doLastDay && new Date(e.created_at)<=doLastWeek ) 
											});
		
		$scope.lastDay_wo_pull_closed = $scope.openActualIssues.filter(function(e){ return new Date(e.created_at)>doLastDay })
		$scope.lastWeek_wo_pull_closed = $scope.openActualIssues.filter(function(e){ return new Date(e.created_at)>doLastWeek })
		$scope.morethanWeek_wo_pull_closed = $scope.openActualIssues.filter(function(e){ 
												return (new Date(e.created_at)<=doLastDay && new Date(e.created_at)<=doLastWeek )
											});
		
		$scope.lastDay_pull_closed = $scope.openPullRequests.filter(function(e){ return new Date(e.created_at)>doLastDay })
		$scope.lastWeek_pull_closed = $scope.openPullRequests.filter(function(e){ return new Date(e.created_at)>doLastWeek })
		$scope.morethanWeek_pull_closed = $scope.openPullRequests.filter(function(e){ 
												return (new Date(e.created_at)<=doLastDay && new Date(e.created_at)<=doLastWeek )
											});
	}

});