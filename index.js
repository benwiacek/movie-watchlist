const input = document.getElementById("input")
const search = document.getElementById("search-form")
const movieList = document.getElementById("movie-list")
const myMovieList = document.getElementById("my-movie-list")

let moviesResultsArr = []
let listMoviesResults = ""

let myMoviesArr = JSON.parse(localStorage.getItem("My movie list")) || []
let myMoviesHTML = ""

if (search) {
    search.addEventListener("submit", getMovieList)
}

async function getMovieList(e) {
    e.preventDefault();
    moviesResultsArr = []
    listMoviesResults = ""
    const res = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&s=${input.value}&type=movie&r=json`)
    const data = await res.json()
    console.log(data)
    if(data.Response === "True") {
        for(const result of data.Search) {
            const movieRes = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&i=${result.imdbID}&r=json`)
            const movieData = await movieRes.json()
            moviesResultsArr.push(movieData)
        }

        for(const movie of moviesResultsArr) {
            listMoviesResults += 
            `<div class="movie">
                <img src="${movie.Poster} alt="${movie.Title} poster" class="poster">
                <div class="movie-block">
                    <div class="movie-headline">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <a href="https://www.imdb.com/title/${movie.imdbID}" class="rating"><img class="star-icon" src="/images/icon-star.png">${movie.imdbRating}</a>
                    </div>
                    <div class="movie-details">
                        <p class="runtime">${movie.Runtime}</p> 
                        <p class="genre">${movie.Genre}</p>
                        <div class="add-movie" data-id="${movie.imdbID}">
                            <img class="plus-icon" src="/images/plus-icon.png">
                            <span>Watchlist</span>
                        </div>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div>`
        }
    } else {
        listMoviesResults = `<div class="error-text">Unable to find what you’re looking for. Please try another search.</div>`
    }

    movieList.innerHTML = listMoviesResults
}

if (movieList) {
    movieList.addEventListener("click", function(e) {
        const addMovieBtn = e.target.closest(".add-movie")
        if(addMovieBtn && addMovieBtn.dataset.id) {
            addMyMovie(addMovieBtn.dataset.id)
        }
    })
}

async function addMyMovie(filmId) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&i=${filmId}&r=json`)
    const movie = await res.json()
    if (!myMoviesArr.includes(movie)) {
        myMoviesArr.push(movie)
    }
    console.log("movie-added")
    console.log(myMoviesArr)
    localStorage.setItem("My movie list", JSON.stringify(myMoviesArr))
}

// function renderMyList() {
//     for(const movie of myMoviesArr) {
//         myMoviesHTML =
//         `<div class="movie">
//             <img src="${movie.Poster} alt="${movie.Title} poster" class="poster">
//             <div class="movie-block">
//                 <div class="movie-headline">
//                     <h3 class="movie-title">${movie.Title}</h3>
//                     <a href="https://www.imdb.com/title/${movie.imdbID}" class="rating"><img class="star-icon" src="/images/icon-star.png">${movie.imdbRating}</a>
//                 </div>
//                 <div class="movie-details">
//                     <p class="runtime">${movie.Runtime}</p> 
//                     <p class="genre">${movie.Genre}</p>
//                     <div class="add-movie" data-id="${movie.imdbID}">
//                         <img class="plus-icon" src="/images/plus-icon.png">
//                         <span>Watchlist</span>
//                     </div>
//                 </div>
//                 <p class="movie-plot">${movie.Plot}</p>
//             </div>
//         </div>`
//     }
//     myMovieList.innerHTML = myMoviesHTML
// }

// renderMyList()
// console.log(myMoviesArr)