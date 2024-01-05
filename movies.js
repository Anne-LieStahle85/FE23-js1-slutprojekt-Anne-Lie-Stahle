//I denna filen har jag kod för mina knappar toprated
//och popular. Även kod till mina filmer som visas direkt
const btnTopRated = document.querySelector("#btnTopRated");
const btnPopular = document.querySelector("#btnPopular");

btnPopular.addEventListener("click", (event) => {
  event.preventDefault();
  fetchMovies(btnPopular).then(displayMovies).catch(displayError);

  resetSearchResults();
});

btnTopRated.addEventListener("click", (event) => {
  event.preventDefault();
  fetchMovies(btnTopRated).then(displayMovies).catch(displayError);

  resetSearchResults();
});

function resetSearchResults() {
  const moviePersonContainer = document.querySelector("#moviePersonInfo");
  moviePersonContainer.innerHTML = "";
  const errorMessageEl = document.querySelector("#errorMessage");
  errorMessageEl.innerHTML = "";
}

async function fetchMovies(category) {
  const BEARER_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2NmMDhkMGI3NjY2MmQyNWIwMmMxNzRiZGQzYjBiYyIsInN1YiI6IjY1ODAwNTY5OGRiYzMzMDg3NDk5OTAzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B1hD_04nC89nERiJ8TgNFfy65QlZUrHeuxTHr9IxPIE";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER_KEY}`,
    },
  };

  let url;
  if (category === btnPopular) {
    url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
  } else if (category === btnTopRated) {
    url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`;
  }

  try {
    const response = await fetch(url, options);
    console.log(response);

    if (response.ok) {
      const movies = await response.json();
      if (movies.results && movies.results.length > 0) {
        return movies.results.slice(0, 10);
      } else {
        throw "Error fetching movie";
      }
    }
  } catch (error) {
      throw error;
  }
}

async function mainmovies() {
  const BEARER_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2NmMDhkMGI3NjY2MmQyNWIwMmMxNzRiZGQzYjBiYyIsInN1YiI6IjY1ODAwNTY5OGRiYzMzMDg3NDk5OTAzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B1hD_04nC89nERiJ8TgNFfy65QlZUrHeuxTHr9IxPIE";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER_KEY}`,
    },
  };

  const mainURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

  try {
    const response = await fetch(mainURL, options);
    console.log(response);

    if (response.ok) {
      const movies = await response.json();
      if (movies.results && movies.results.length > 0) {
        const top20Movies = movies.results.slice(0, 20);
        displayMovies(top20Movies);
      } else {
        throw "Error fetching movies";
      }
    }
  } catch (error) {
    console.error(error);
    displayError(error);
  }
}

mainmovies();

function displayMovies(movies) {
  const movieContainer = document.querySelector("#moviePersonInfo");
  movieContainer.innerHTML = "";

  for (const movie of movies) {
    const movieCardDiv = document.createElement("div");
    movieCardDiv.classList.add("item-card");
    const imgUrl = "https://image.tmdb.org/t/p/w500/";

    createAndAppendElement("img", imgUrl + movie.poster_path, movieCardDiv);
    createAndAppendElement("h1", movie.title, movieCardDiv);
    createAndAppendElement("h3", movie.release_date, movieCardDiv);

    movieContainer.append(movieCardDiv);
  }
}

function createAndAppendElement(type, content, container) {
  const element = document.createElement(type);
  container.append(element);

  if (type === "img") {
    element.src = content;
  } else {
    element.innerText = content;
  }

  return element;
}

function displayError(error){
  console.log(error)
  let message = "Something went wrong...Try again";

  const errorMessageEl = document.querySelector("#errorMessage");
  errorMessageEl.innerText = message;

  const errorContainer = document.querySelector("#errorContainer");
  errorContainer.classList.remove("hide");
}

anime ({
  targets: `#btnTopRated, #btnPopular`,
  translateX: 350,
  translateX: 0,
  
  rotate: '1turn',
  loop: false,
});
