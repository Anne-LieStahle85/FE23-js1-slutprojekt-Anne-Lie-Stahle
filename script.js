const restart = document.querySelector("#restartPage");
restart.addEventListener("click", (event)=>{
  event.preventDefault();
  location.reload();
})

const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  resetSearchResults();

  const userInput = document.querySelector("#searchInput").value;
  const userChoice = document.querySelector(
    "input[type='radio']:checked"
  ).value;

  try {
    const data = await fetchData(userChoice, userInput);
    console.log(data);
    displayMovieOrPerson(data, userChoice);
  } catch (error) {
    console.log(error);
    displayError(error.message || "Something went wrong...Try again");
  }

  form.reset();
  
}

function resetSearchResults() {
  const moviePersonContainer = document.querySelector("#moviePersonInfo");
  moviePersonContainer.innerHTML = "";
  const errorMessageEl = document.querySelector("#errorMessage");
  errorMessageEl.innerHTML = "";
}

async function fetchData(userChoice, userInput) {
  const BEARER_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2NmMDhkMGI3NjY2MmQyNWIwMmMxNzRiZGQzYjBiYyIsInN1YiI6IjY1ODAwNTY5OGRiYzMzMDg3NDk5OTAzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B1hD_04nC89nERiJ8TgNFfy65QlZUrHeuxTHr9IxPIE";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER_KEY}`,
    },
  };

  let baseUrl;

  if (userChoice === "movie") {
    baseUrl = `https://api.themoviedb.org/3/search/movie`;
  } else if (userChoice === "person") {
    baseUrl = `https://api.themoviedb.org/3/search/person`;
  } else {
    throw new Error("Invalid user choice");
  }

  const queries = `?query=${userInput}&include_adult=false&language=en-US&page=1`;
  const url = baseUrl + queries;

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.results && data.results.length > 0) {
        return data.results;
      } else {
        throw new Error(`${userChoice} not found(404)`);
      }
    }
  } catch (error) {
    throw error;
  }
}

function displayMovieOrPerson(data, userChoice) {
  console.log(data, userChoice);
  const moviePersonContainer = document.querySelector("#moviePersonInfo");

  for (const item of data) {

    const itemCardDiv = document.createElement("div");
    itemCardDiv.classList.add("item-card");
    const ImgUrl = "https://image.tmdb.org/t/p/w500/";

    if (userChoice === "movie") {
      createAndAppendElement("img", ImgUrl + item.poster_path, itemCardDiv);
      createAndAppendElement("h1", item.title, itemCardDiv);
      createAndAppendElement("h3", item.release_date, itemCardDiv);
      createAndAppendElement("p", item.overview, itemCardDiv);
    } else if (userChoice === "person") {
      createAndAppendElement("img", ImgUrl + item.profile_path, itemCardDiv);
      createAndAppendElement("h1", item.name, itemCardDiv);
      createAndAppendElement("h3", item.known_for_department, itemCardDiv);

      if (item.known_for && Array.isArray(item.known_for)){
        for(const knownForItem of item.known_for){
          const mediaType = knownForItem.media_type;
          const title = knownForItem.title;
          const name = knownForItem.name;

          if (mediaType && title){
            createAndAppendElement("p", `${mediaType}: ${title}` , itemCardDiv);
          }else if(mediaType && name){
            createAndAppendElement("p", `${mediaType}: ${name}` , itemCardDiv );
          }
        }
      }

    }

    moviePersonContainer.append(itemCardDiv);
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

function displayError(error) {

  const errorMessageEl = document.querySelector("#errorMessage");
  // const errorContainer = document.querySelector("#errorContainer");

  let message;

  if(error.includes("404")){
    if(error.includes("movie")){
      message = "That's not a movie...Try again!";
    }
    else if(error.includes("person")){
      message = "That's not a person...Try again!";
    }
  }
  else{
    message = "Something went wrong...Try again!";
  }

  errorMessageEl.innerText = message;
  
}

