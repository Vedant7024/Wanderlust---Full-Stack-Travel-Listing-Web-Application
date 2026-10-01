mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9
});


const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${listing.title}</h3><p>Exact Location will be provided booking</p>`)
    )
    .addTo(map);

    //we can add multiple merker but we have to change the coordinates 

    // const marker2 = new mapboxgl.Marker({ color: "red" })
    // .setLngLat(listing.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({ offset: 25 })
    //         .setHTML(`<h3>${listing.title}</h3><p>Exact Location will be provided booking</p>`)
    // )
    // .addTo(map);




