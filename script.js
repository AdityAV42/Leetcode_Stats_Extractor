document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("user-input");
    const searchButton = document.getElementById("search-btn");

    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const errorMessage = document.getElementById("error-message");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");

    //return true/false based on regex(by genAI)
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty.");
            return false;
        }
        const regex = /^[A-Za-z0-9_-]{3,20}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username!");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            // Show container but hide content while loading
            statsContainer.classList.remove("hidden");
            document.querySelector(".progress").classList.add("hidden");
            document.querySelector(".stats-cards").classList.add("hidden");
            errorMessage.classList.add("hidden");

            const response = await fetch(url); //get request - async operation
            if (!response.ok) {
                //response status not ok
                throw new Error("Unable to fetch the user details!");
            }
            const data = await response.json(); //parse json --> async
            console.log("Logging data: ", data);

            // Check for API-specific error
            if (data.status === "error") {
                throw new Error(data.message || "User not found");
            }

            displayUserData(data);
        } catch (error) {
            // Show error state
            statsContainer.classList.remove("hidden");
            document.querySelector(".progress").classList.add("hidden");
            document.querySelector(".stats-cards").classList.add("hidden");
            errorMessage.classList.remove("hidden");
            errorMessage.textContent = error.message;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        // Show all elements
        statsContainer.classList.remove("hidden");
        document.querySelector(".progress").classList.remove("hidden");
        document.querySelector(".stats-cards").classList.remove("hidden");
        errorMessage.classList.add("hidden");

        const totalQues = data.totalQuestions;
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const solvedTotalQues = data.totalSolved;
        const solvedTotalEasyQues = data.easySolved;
        const solvedTotalMediumQues = data.mediumSolved;
        const solvedTotalHardQues = data.hardSolved;

        updateProgress(
            solvedTotalEasyQues,
            totalEasyQues,
            easyLabel,
            easyProgressCircle
        );
        updateProgress(
            solvedTotalMediumQues,
            totalMediumQues,
            mediumLabel,
            mediumProgressCircle
        );
        updateProgress(
            solvedTotalHardQues,
            totalHardQues,
            hardLabel,
            hardProgressCircle
        );

        const cardsData = [
            { label: "Acceptance Rate", value: data.acceptanceRate },
            { label: "Questions solved ranking", value: data.ranking },
            { label: "contribution Points", value: data.contributionPoints },
            { label: "reputation", value: data.reputation },
        ];
        console.log("card data:", cardsData);

        cardStatsContainer.innerHTML = cardsData
            .map(
                (data) =>
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
            )
            .join("");
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("loggin username: ", username);
        if (validateUsername(username)) {
            //fetch data via API call
            fetchUserDetails(username);
        }
    });
});
