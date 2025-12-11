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
    for(const result of data.Search) {
        const movieRes = await fetch(`http://www.omdbapi.com/?apikey=8a8e1701&i=${result.imdbID}&r=json`)
        const movieData = await movieRes.json()
        moviesArr.push(movieData)
    }
    console.log(moviesArr)
    for(const movie of moviesArr) {
        listMovies += `<p>${movie.Title}</p>`
    }
    console.log(listMovies)
    movieList.innerHTML = listMovies
}