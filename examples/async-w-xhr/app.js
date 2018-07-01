(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    console.log(searchedForText);

    // COMPLETE create new XHR Object for image
    const imgReq = new XMLHttpRequest();
    // COMPLETE assign onload property to a function
    imgReq.onload = addImage;
    // COMPLETE assign onerror property to a function
    imgReq.onerror = requestError;
    // COMPLETE make an open request
    imgReq.open('GET', 
      `https://api.unsplash.com/search/photos?query=${searchedForText}`
    );
    // COMPLETE set request header
    imgReq.setRequestHeader(
      'Authorization',
      'Client-ID YOUR_API_KEY'
    );
    // COMPLETE send the request
    imgReq.send();

    // COMPLETE create new XHR Object for articles
    const articleReq = new XMLHttpRequest();
    // COMPLETE assign onload property to a function
    articleReq.onload = addArticles;
    // COMPLETE assign onerror property to a function
    articleReq.onerror = requestError;

    // COMPLETE make an open request
    articleReq.open(
      'GET',
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`
    );
    // COMPLETE send the request
    articleReq.send();
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
