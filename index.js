const input = document.getElementById("input")
const search = document.getElementById("search-form")
const movieList = document.getElementById("movie-list")
const myMovieList = document.getElementById("my-movie-list")
const clearBtn = document.getElementById("clear-btn")

let htmlString = ""

let moviesResultsArr = []
let listResultsHTML = ""

let myMoviesArr = JSON.parse(localStorage.getItem("My movie list")) || []
let myMoviesHTML = ""

if (search) {
    search.addEventListener("submit", getMovieList)
}

async function getMovieList(e) {
    e.preventDefault();
    moviesResultsArr = []
    listResultsHTML = ""
    const res = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&s=${input.value}&type=movie&r=json`)
    const data = await res.json()
    if(data.Response === "True") {
        for(const result of data.Search) {
            const movieRes = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&i=${result.imdbID}&r=json`)
            const movieData = await movieRes.json()
            moviesResultsArr.push(movieData)
        }
        listResultsHTML = renderList(moviesResultsArr)
    } else {
        listResultsHTML = `<div class="placeholder-div error-div">
                                <p class="error-text">Unable to find what you’re looking for.
                                Please try another search.</p>
                            </div>`
    }
    movieList.innerHTML = listResultsHTML
}

function renderList(arr) {
    htmlString = ""
    for(const movie of arr) {
        htmlString += 
        `<div class="movie">
            <img src="${movie.Poster} alt="${movie.Title} poster" class="poster">
            <div class="movie-block">
                <div class="movie-headline">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <span class="movie-year">(${movie.Year})</span>
                    <a href="https://www.imdb.com/title/${movie.imdbID}" class="rating"><img class="star-icon" src="/images/icon-star.png">${movie.imdbRating}</a>
                </div>
                <div class="movie-details">
                    <p class="runtime">${movie.Runtime}</p> 
                    <p class="genre">${movie.Genre}</p>
                    <div class${myMoviesArr.find(mov => mov.imdbID === movie.imdbID)?
                        getRemoveMovieBtn (movie.imdbID)
                        :
                        getAddMovieBtn (movie.imdbID)
                    }   
                </div>
                <p class="movie-plot">${movie.Plot}</p>
            </div>
        </div>`
    }
    return htmlString
}

function getRemoveMovieBtn (filmId) {
    return `<div class="remove-movie" data-id="${filmId}">
        <img class="minus-icon" src="/images/minus-icon.png">
        <span>remove</span>
        </div>`
}

function getAddMovieBtn (filmId) {
    return `<div class="add-movie" data-id="${filmId}">
        <img class="plus-icon" src="/images/plus-icon.png">
        <span>Add to watchlist</span>
        </div>`
}

if (movieList) {
    movieList.addEventListener("click", (e) => {
        const addMovieBtn = e.target.closest(".add-movie")
        if(addMovieBtn && addMovieBtn.dataset.id) {
            addMyMovie(addMovieBtn.dataset.id)
            addMovieBtn.outerHTML = getRemoveMovieBtn (addMovieBtn.dataset.id)
        }

        const removeMovieBtn = e.target.closest(".remove-movie")
        if (removeMovieBtn && removeMovieBtn.dataset.id) {
            removeMovie(removeMovieBtn.dataset.id)
            removeMovieBtn.outerHTML = getAddMovieBtn (removeMovieBtn.dataset.id) 
        }
    })       
}

function addMyMovie(filmId) {
    const movieChoice = myMoviesArr.find(movie => movie.imdbID === filmId)
    if (!movieChoice) {
        const movieToAdd = moviesResultsArr.find(movie => movie.imdbID === filmId)
        myMoviesArr.push(movieToAdd)
        localStorage.setItem("My movie list", JSON.stringify(myMoviesArr))
    } 
}

function removeMovie(filmId) {
    const movieChoice = myMoviesArr.find(movie => movie.imdbID === filmId)
    if (movieChoice) {
        const movIndexToRemove = myMoviesArr.findIndex(movie => movie.imdbID === filmId)
        if (movIndexToRemove > -1) {
            myMoviesArr.splice(movIndexToRemove, 1)
            localStorage.setItem("My movie list", JSON.stringify(myMoviesArr))
        }
    }
}

if(myMovieList) {
    function renderMyMovieList() {
        if (myMoviesArr.length === 0) {
            myMoviesHTML = 
            `<div class="placeholder-div">
                <p class="placeholder-text">Your watchlist is looking a little empty...</p>
                <div class="add-movie" id="add-movie">
                    <img class="plus-icon" src="/images/plus-icon.png">
                    <a class="empty-list" href="./index.html">Let's add some movies!</a>
                </div>
            </div>`
        } else {
            myMoviesHTML = `<p class="empty-btn" id="clear-btn">Empty my list</p>` + renderList(myMoviesArr)
        }
        myMovieList.innerHTML = myMoviesHTML
    }
    renderMyMovieList()

    myMovieList.addEventListener("click", (e) => {
        if (e.target.closest("#clear-btn")) {
            localStorage.clear()
            myMoviesArr = []
            renderMyMovieList()
        }

        const removeMovieBtn = e.target.closest(".remove-movie")
        if (removeMovieBtn && removeMovieBtn.dataset.id) {
            removeMovie(removeMovieBtn.dataset.id)
            renderMyMovieList()
        }
    })
}