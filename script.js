// Asynchronous function to get repositories that takes username as an argument
async function fetchRepositories(username) {

    // Try to run this block of code and handle errors
    try {
        let response; // Initialize the response variable
        const emptyUser = username.trim() === ""; // emptyUser is true if the username without whitespace is empty

        // If the radio input with the id of "github" is checked
        if (document.getElementById("github").checked == true) {
            if (emptyUser) throw new Error("Please input your username!"); // Throw an error object if the username is empty
            response = await fetch(`https://api.github.com/users/${username}/repos`); // Fetch from the GitHub API

        // If the radio input with the id of "codeberg" is checked
        } else if (document.getElementById("codeberg").checked == true) {
            if (emptyUser) throw new Error("Please input your username!"); // Throw an error object if the username is empty
            response = await fetch(`https://codeberg.org/api/v1/users/${username}/repos`); // Fetch from the Codeberg API

        // If else (neither is selected)
        } else {

            // This error message says that both fields need input since the fact that this line is in an else block indicates that both radio inputs are also unchecked
            if (emptyUser) throw new Error("Please input your username and pick a platform!"); // Throw an error object if the username is empty

            // If else (there is an inputted username)
            else throw new Error("Please choose a platform to get repositories from!"); // Throw an error object
        };

        // If the response HTTP status is not 200 (OK), throw an HTTP error containing the status code as a string
        if (!response.ok) throw new Error("HTTP error! Status code: " + response.status.toString());

        const data = await response.json(); // Get the response body as JSON
        return data; // Return the data

        // Catch any errors, which will be represented as err
    } catch (err) {
        alert(err.message); // If there's an error, the GitHub API and Codeberg API return a JSON object with a message property that contain an error message

        const repoListParent = document.getElementById("repo-list"); // Get the <ul> containing the repositories from the DOM
        if (repoListParent.hasChildNodes()) repoListParent.innerHTML = ""; // Empty the list on the webpage if the list has any children (<li> items)

        return err; // Return the error to stop program execution
    };
};

let submitCount = 0; // Initialize a count variable for counting form submissions

// Function to display the repositories as a list
// This function is asynchronous so we can use the await keyword on fetchRepositories, which only stores the result of the promise that fetchRepositories() returns
async function listRepositories() {

    // Try to run this block of code and handle errors
    try {

        // When using the value property, it's important that it's used when the user has already inputted something or else it'll just be blank.
        const username = document.getElementById("user").value; // Get the value of the input element with an id of "user"
        const repoList = []; // Initialize an empty array for storing the repositories

        // Try to run this block of code and handle errors
        try {
            const repos = await fetchRepositories(username); // Call the fetchRepositories() function with the username passed to it (this returns an array of all the repositories due to the JSON formatting the GitHub and Codeberg API uses)

            // Perform a function for each item in the repos array, where an individual item is passed to the function as repo
            repos.forEach(repo => {
                // target="_blank" opens a new tab when the link is clicked instead of replacing the existing webpage (personal preference)
                repoList.push(`<a href="${repo.html_url}" target="_blank">${repo.name}</a>`); // Create an <a> element with the link of the repository and with the repository name and add it to the repoList array
            });

        // Catch any errors (if repos doesn't work the error will most likely be that repos.forEach is not a function and I don't want that to show)
        } catch (err) { return err }; // Return the error to stop program execution

        // Function to create a list element with HTMLContent passed to it
        const createListElement = HTMLContent => {
            const li = document.createElement("li"); // Create a <li> element in the DOM
            li.innerHTML = HTMLContent; // Add the HTML content passed to the function inside <li> (the HTML is placed inside of the original tags so it's still a <li> element)
            li.classList.add("repo"); // Add the class of "repo" to the <li> item
            document.getElementById("repo-list").append(li); // Add the final result of <li> to the element with an id of "repo-list", which is an unordered list in index.html
        };

        /*
         * 1. If the form is not submitted, display the repositories.
         * 2. If the form was submitted, clear the DOM, display the repositories again, and update cleared state to true.
         * 3. After the loop, update submitted state to true to prevent repo duplication & set cleared state to false since the DOM was updated with the repositories again
         */

        let cleared = false; // Initialize a variable to track DOM clearing (false because the original state is uncleared)
        let submitted; // Initialize a variable to track if the form was submitted (undefined because the state is defined by the amount of times the form was submitted)

        submitCount === 0 ? submitted = false: // If the form was submitted 0 times, set submitted to false
        submitted = true; // If else (form was submitted 1+ times), set submitted to true

        // For each item in the repoList array, where an individual item is represented as repo_html (because it contains HTML content for each repo)
        for (const repoHTML of repoList) {

            // If the form was not submitted
            if (!submitted) {
                createListElement(repoHTML); // Create <li> elements for each repository

            // If else (form was submitted)
            } else {

                // If the DOM wasn't cleared
                if (!cleared) {
                    document.getElementById("repo-list").innerHTML = ""; // Empty everything inside the repository list on the webpage
                    cleared = true; // Update the state of cleared to true so that the program knows the DOM was cleared
                };

                createListElement(repoHTML); // Create <li> elements for each repository after the DOM is cleared
            };
        };

        cleared = false; // Set cleared back to false so that the DOM is cleared when the button is clicked again

    // Catch any errors where the error is represented as err
    } catch (err) {
        alert(err); // Send an alert to the window containing the error
        return err; // Return the error to stop program execution
    };
};

// Add an event listener to the <form> element that detects when the form is submitted (the input with a type of "submit" is clicked)
document.querySelector("form").addEventListener("submit", () => {
    listRepositories(); // Call the listRepositories() function
    submitCount++; // Increase the amount of times the button was submitted
});