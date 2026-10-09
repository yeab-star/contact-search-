const API_URL = "https://dummyjson.com/users";


const state = {
    users: [],
    favorites: [],
    search: ""
};


const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const usersContainer = document.getElementById("usersContainer");
const favoritesContainer = document.getElementById("favoritesContainer");

const favoriteCount = document.getElementById("favoriteCount");
const userCount = document.getElementById("userCount");
const resultsText = document.getElementById("resultsText");

const loading = document.getElementById("loading");
const appContent = document.getElementById("appContent");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const retryButton = document.getElementById("retryButton");

const noResults = document.getElementById("noResults");
const emptyFavorites = document.getElementById("emptyFavorites");


function loadFavorites() {

    const savedFavorites =
        localStorage.getItem("favoriteContacts");

    if (savedFavorites) {

        try {

            state.favorites =
                JSON.parse(savedFavorites);

        } catch (error) {

            console.error(
                "Could not load favorites:",
                error
            );

            state.favorites = [];
        }

    } else {

        state.favorites = [];

    }
}


function saveFavorites() {

    localStorage.setItem(
        "favoriteContacts",
        JSON.stringify(state.favorites)
    );
}



async function fetchUsers() {

   loading.style.display = "flex";
 appContent.style.display = "none";
 errorMessage.style.display = "none";
 try {

        const response = await fetch(API_URL);

 if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }
 const data = await response.json();

 state.users = data.users;

        userCount.textContent =
            `${state.users.length} Contacts`;

        renderUsers();

        renderFavorites();

        appContent.style.display = "grid";


    } catch (error) {

        console.error(
            "Error fetching users:",
            error
        );


        errorText.textContent =
            "Unable to load contacts. Please check your internet connection and try again.";


        errorMessage.style.display =
            "block";


    } finally {

        loading.style.display = "none";

    }
}


function getFilteredUsers() {

    return state.users.filter(function(user) {

        return user.firstName
            .toLowerCase()
            .includes(
                state.search.toLowerCase()
            );

    });

}



function renderUsers() {

    const filteredUsers =
        getFilteredUsers();


    resultsText.textContent =
        `${filteredUsers.length} contacts found`;

    usersContainer.innerHTML = "";

    if (filteredUsers.length === 0) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    filteredUsers.forEach(function(user) {

        const isFavorite =
            state.favorites.includes(user.id);


        const card =
            document.createElement("article");


        card.className =
            "user-card";


        card.innerHTML = `

            <button
                class="favorite-btn ${isFavorite ? "active" : ""}"
                onclick="toggleFavorite(${user.id})"
                title="${isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}"
            >
                ${isFavorite ? "♥" : "♡"}
            </button>


            <div class="user-top">

                <img
                    class="user-image"
                    src="${user.image}"
                    alt="${user.firstName} ${user.lastName}"
                >

                <div>

                    <h3 class="user-name">
                        ${user.firstName} ${user.lastName}
                    </h3>

                    <p class="user-company">
                        ${user.company.name}
                    </p>

                </div>

            </div>


            <p class="user-email">
                ✉ ${user.email}
            </p>

        `;


        usersContainer.appendChild(card);

    });

}


function toggleFavorite(userId) {

    const favoriteIndex =
        state.favorites.indexOf(userId);

    if (favoriteIndex === -1) {

        state.favorites.push(userId);

    }

    else {

        state.favorites.splice(
            favoriteIndex,
            1
        );

    }

    saveFavorites();

    renderUsers();
    renderFavorites();

}



function renderFavorites() {

    favoritesContainer.innerHTML = "";

    favoriteCount.textContent =
        `${state.favorites.length} saved ${
            state.favorites.length === 1
                ? "contact"
                : "contacts"
        }`;

    if (state.favorites.length === 0) {

        emptyFavorites.style.display =
            "block";

        return;

    }


    emptyFavorites.style.display =
        "none";


    state.favorites.forEach(function(id) {

        const user =
            state.users.find(function(item) {

                return item.id === id;

            });


        if (!user) {
            return;
        }


        const favoriteItem =
            document.createElement("div");


        favoriteItem.className =
            "favorite-item";


        favoriteItem.innerHTML = `

            <img
                src="${user.image}"
                alt="${user.firstName} ${user.lastName}"
            >

            <div class="favorite-info">

                <h4>
                    ${user.firstName} ${user.lastName}
                </h4>

                <p>
                    ${user.company.name}
                </p>

            </div>

            <button
                class="remove-favorite"
                onclick="toggleFavorite(${user.id})"
                title="Remove favorite"
            >
                ×
            </button>

        `;


        favoritesContainer.appendChild(
            favoriteItem
        );

    });

}



searchInput.addEventListener(
    "input",
    function(event) {

        state.search =
            event.target.value.trim();


        renderUsers();

    }
);


clearSearch.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        state.search = "";

        renderUsers();

        searchInput.focus();

    }
);


retryButton.addEventListener(
    "click",
    function() {

        fetchUsers();

    }
);


function init() {

   
    loadFavorites();


    fetchUsers();

}



init();