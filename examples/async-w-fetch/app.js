(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    // COMPLETE log the searched text
    console.log(searchedForText);

    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization:
            'Client-ID e30dcbd33dcdfe710cbf09deadb3879953d4b938db45fcfe4bde9ddd6deeacdb'
        }
      }
    )
    .then(function(response) {
      return response.json();
    })
    .then(addImage)
    .catch(requestError);

    fetch(
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`
    )
      .then(function(response) {
        return response.json();
      })
      .then(addArticles)
      .catch(requestError);
  });

  function addImage(data) {
    let htmlContent = '';
    // TODO remove JSON.parse and add params to this function
    // You can use arrow functions now

    if (data && data.results && data.results[0]) {
      const firstImage = data.results[0];
      htmlContent = `
      <figure>
        <img src="${firstImage.urls.regular}" alt="${searchedForText}" />
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
      </figure>`;
    } else {
      htmlContent = '<div class="error-no-image">No images available</div>';
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function addArticles(data) {
    let htmlContent = '';
    // TODO remove JSON.parse and add params to this function
    // You can use arrow functions now

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      htmlContent =
        '<ul>' +
        data.response.docs
          .map(
            article => `
            <li class="article">
              <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
              <p>${article.snippet}</p>
            </li>
          `
          )
          .join('') +
        '</ul>';
    } else {
      htmlContent =
        '<div class="error-no-articles">No articles available</div>';
    }

    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }

  const requestError = (err, part) => {
    // Simulate offline
    console.log(err);
    responseContainer.insertAdjacentHTML(
      'beforeend',
      `<p class="network-warning error-${part}">Oh no! There was an error making a request for the ${part}.</p>`
    );
  };
})();
