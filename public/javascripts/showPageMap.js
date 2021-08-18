mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/yrtravi-7/cksg3thwml6o418nx7dcij0ag', 
  center: trip.geometry.coordinates, 
  zoom: 6
});

new mapboxgl.Marker({color: '#FFA07A'})
    .setLngLat(trip.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(
        `<h6>${trip.place}, ${trip.location}</h6>`
      )
    )
    .addTo(map);