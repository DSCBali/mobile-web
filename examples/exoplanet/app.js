var home = document.getElementById('container');

const loadPlanets = () => {
  getJSON('./data/earth-like-results.json')
    .then(response => {
      addHeader(response.query);
      console.log(response);

      const firstPlanet = response.results[0];
      return getJSON(firstPlanet).then(response => {
        console.log(response);
      });
    })
    .catch(function(error) {
      addHeader('unknown');
      console.log(error);
    });
};

const getJSON = url => {
  console.log('sent: ' + url);
  return fetch(url).then(response => {
    console.log('received: ' + url);
    return response.json();
  });
};

function addHeader(query) {
  home.innerHTML = '<h2>query: ' + query + '</h2>';
}
