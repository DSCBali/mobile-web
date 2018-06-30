(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    // TODO log the searched text

    // TODO create new XHR Object for image
    // TODO assign onload property to a function
    // TODO assign onerror property to a function
    // TODO make an open request
    // TODO set request header
    // TODO send the request

    // TODO create new XHR Object for articles
    // TODO assign onload property to a function
    // TODO assign onerror property to a function
    // TODO make an open request
    // TODO send the request
  });

  function addImage() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);

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

  function addArticles() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);

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
