const albumInput = document.querySelector("#search-input");
const albumRatingInput = document.querySelector("#min-album-rating-input");
const albumSearchForm = document.querySelector("#album-search-form");
const invalidTitle = document.querySelector("#invalid-title");
const invalidRating = document.querySelector("#invalid-rating");

/* TASK #1 */
const albumRows = document.querySelector("#album-rows");
const url = "public/data/albums.json";

//fetch album data
async function fetchAlbumData() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No data found");
    }
    const data = await response.json();

    console.table(data); //Log Data for verification purposes
    return data;
  } catch (error) {
    throw error;
  }
}

//create fetched data backup
const albumStore = await fetchAlbumData();

//Function to render the albums data
async function renderAlbumsData() {
  //Create a copy of the data store
  const albumStoreCopy = [...albumStore];
  try {
    albumStoreCopy.forEach((album) => {
      const albumtemplate = `
        <tr>
          <td>${album.album}</td>
          <td>${album.releaseDate}</td>
          <td>${album.artistName}</td>
          <td>${album.genres}</td>
          <td>${album.averageRating}</td>
          <td>${album.numberRatings}</td>
        </tr> `;
      albumRows.innerHTML += albumtemplate;
    });
  } catch (error) {
    throw error;
  }
}
renderAlbumsData(); //render albums data on init

/* TASK #2 */

//Add Event handlers
albumSearchForm.addEventListener("submit", onSubmitAlbumSearch);
albumInput.addEventListener("input", onHandleAlbumInput);
albumRatingInput.addEventListener("input", onHandleAlbumRatingInput);

function onSubmitAlbumSearch(e) {
  e.preventDefault();
  isSuccess();
}

//Validate values from input fields
function validateInputFields() {
  const albumTitle = albumInput.value.toLowerCase().trim();
  const albumRating = albumRatingInput.value.trim();

  if (albumTitle === "" && (isNaN(albumRating) || albumRating === "")) {
    invalidTitle.classList.add("d-flex");
    invalidRating.classList.add("d-flex");
  } else {
    invalidTitle.classList.remove("d-flex");
    invalidRating.classList.remove("d-flex");
  }

  return { albumTitle, albumRating };
}

//Handle warnings on input event
function onHandleAlbumInput() {
  if (albumInput.value) {
    invalidTitle.classList.remove("d-flex");
  }
}

function onHandleAlbumRatingInput() {
  const albumRating = albumRatingInput.value.trim();

  if (albumRating === "" || isNaN(albumRating)) {
    invalidRating.classList.add("d-flex");
  } else {
    invalidRating.classList.remove("d-flex");
  }
}

//search for the album title/artist name using filter function
function searchAlbumOrArtist(searchCriteria) {
  if (!searchCriteria) {
    return [];
  }
  const query = searchCriteria;

  const results = albumStore.filter((album) => {
    if (album.album.toLowerCase().includes(query)) {
      return album;
    }
    if (album.artistName.toLowerCase().includes(query)) {
      return album;
    }
  });
  return results;
}

//Search for the album rating using filter function
function searchAlbumByRating(searchCriteria) {
  const query = searchCriteria;

  if (query === "" || isNaN(query)) {
    return [];
  }

  const results = albumStore.filter((album) => {
    return album.averageRating.toString().includes(query);
  });

  return results;
}

//Render search results
function renderAlbumSearch(searchCriteria) {
  try {
    albumRows.innerHTML = "";

    if (searchCriteria.length > 0) {
      searchCriteria.forEach((album) => {
        const albumtemplate = `
          <tr>
            <td>${album.album}</td>
            <td>${album.releaseDate}</td>
            <td>${album.artistName}</td>
            <td>${album.genres}</td>
            <td>${album.averageRating}</td>
            <td>${album.numberRatings}</td>
          </tr> `;
        albumRows.innerHTML += albumtemplate;
      });
    } else {
      // Handle case when no albums are found
    }
  } catch (error) {
    console.error(error);
  }
}

//SUCCESS!!!
function isSuccess() {
  const { albumTitle, albumRating } = validateInputFields();

  const albumResults = searchAlbumOrArtist(albumTitle);
  const ratingResults = searchAlbumByRating(albumRating);
  console.log("Search Criteria: ", albumTitle, albumRating);
  console.log(albumResults);
  console.log(ratingResults);

  //renderAlbumSearch(searchAlbumOrArtistResults);
}
