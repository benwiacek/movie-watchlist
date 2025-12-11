const input = document.getElementById("input")
const search = document.getElementById("search-form")
const movieList = document.getElementById("movie-list")

search.addEventListener("submit", getMovieList)
let moviesArr = []
let listMovies = ""

async function getMovieList(event) {
    event.preventDefault();
    moviesArr = []
    listMovies = ""
    const res = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&s=${input.value}&type=movie&r=json`)
    const data = await res.json()
    console.log(data)
    if(data.Response === "True") {
        for(const result of data.Search) {
            const movieRes = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&i=${result.imdbID}&r=json`)
            const movieData = await movieRes.json()
            moviesArr.push(movieData)
        }
        console.log(moviesArr)
        for(const movie of moviesArr) {
            listMovies += 
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
                        <div class="add-movie" id="add-movie">
                            <img class="plus-icon" src="/images/plus-icon.png">
                            <span>Watchlist</span>
                        </div>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div>`
        }
    } else {
        listMovies = `<div class="error-text">Unable to find what you’re looking for. Please try another search.</div>`
    }

    movieList.innerHTML = listMovies
}

// {
//     "Title": "The Prestige",
//     "Year": "2006",
//     "Rated": "PG-13",
//     "Released": "20 Oct 2006",
//     "Runtime": "130 min",
//     "Genre": "Drama, Mystery, Sci-Fi",
//     "Director": "Christopher Nolan",
//     "Writer": "Jonathan Nolan, Christopher Nolan, Christopher Priest",
//     "Actors": "Christian Bale, Hugh Jackman, Scarlett Johansson",
//     "Plot": "Rival 19th-century magicians engage in a bitter battle for trade secrets.",
//     "Language": "English",
//     "Country": "United Kingdom, United States",
//     "Awards": "Nominated for 2 Oscars. 6 wins & 44 nominations total",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BMTM3MzQ5MjQ5OF5BMl5BanBnXkFtZTcwMTQ3NzMzMw@@._V1_SX300.jpg",
//     "Ratings": [
//         {
//             "Source": "Internet Movie Database",
//             "Value": "8.5/10"
//         },
//         {
//             "Source": "Rotten Tomatoes",
//             "Value": "77%"
//         },
//         {
//             "Source": "Metacritic",
//             "Value": "66/100"
//         }
//     ],
//     "Metascore": "66",
//     "imdbRating": "8.5",
//     "imdbVotes": "1,538,383",
//     "imdbID": "tt0482571",
//     "Type": "movie",
//     "DVD": "N/A",
//     "BoxOffice": "$53,089,891",
//     "Production": "N/A",
//     "Website": "N/A",
//     "Response": "True"
// }

// {
//     "Response": "False",
//     "Error": "Movie not found!"
// }