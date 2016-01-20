######################### github_issue_tracker ###############################

1. Issue Tracker Web Application for Github Projects

2. Please check the public/javascripts/tracker.js and routes/routes.js for the logic/implementation.


########################## solution ##########################################

1. My main logic is simple and consists of the following steps

    a. Take the input link
    b. Parse it to valid Github API link
    c. send the requests to Github API continuously till we receive all the issues
    d. Populate a list with json issue objects
    e. Filter the list by using JS filter method for the given requirements
    f. Display everything in UI.



################################## How to use ######################################

1. Open the following link, enter any github repository link and click on "get issues" and wait for 2-5 seconds for the data retrieval to begin,
	https://issue-tracker-github.herokuapp.com/, example link : https://github.com/mbostock/d3

2. Now you will see the total issues ever opened and retrieval status. Wait until retrieval status is "Done",

	Note: pull requests are also considered as issues by default.

3. Click on "Filter the issues" button to see various filters applied to the issues,

4. If you would like to see another repository's issues enter the repository link and click on  "get issues". and repeat the 1,2 and 3 steps.


############################# If more time was given #############################

1. I can replicate most of github website just using the given github api,

2. I would add better validation and error handling,

3. I would develop better looking UI.

4. I would simplify things by splitting the implementation to different parts.


############################ Resources used ########################################

1. JavaScript, HTML, CSS, Bootstrap, Angular.js, Node.js, Express.js and Github API,

2. Google,

3. Heroku,

4. YouTube.

########################### Challenges faced ######################################

1. Initially I was planning to use BeautifulSoup for the main logic but after learning that Github has an web api I had to start writing from the beginning,

2. Learning how to use Github API,

3. Fixing the rate limit issues,

4. Learning how to deploy on Heroku.