let popup = document.getElementById("popup");
let popupContent = document.getElementById("popup-content");
let inputTitle = document.getElementById("title");
let inputDescription = document.getElementById("description");
let inputEntry = document.getElementById("entry");
let inputShow = document.getElementById("show");

let points = [];

let overlay = new ol.Overlay({
  element: popup,
});
let map = new ol.Map({
  target: "container",
  controls: ol.control.defaults({ attribution: false, zoom: false }),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({ crossOrigin: null }),
    }),
  ],
  overlays: [overlay],
  view: new ol.View({
    projection: "EPSG:4326",
    center: [48.494829220701455, 36.68235517361109],
    zoom: 12,
  }),
});

let source = new ol.source.Vector({});
let layer = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: "red",
      }),
    }),
  }),
});

map.addLayer(layer);
let draw = new ol.interaction.Draw({
  source: source,
  type: "Point",
});

draw.on("drawend", (res) => {
  layer.getSource().clear();
  console.log(res);
});

map.addInteraction(draw);

let zoomSlider = new ol.control.ZoomSlider();
map.addControl(zoomSlider);

// map.on("singleclick", (e) => {
//   let coordinate = e.coordinate;
//   popupContent.innerHTML = coordinate;
//   overlay.setPosition(coordinate);
// });

inputEntry.addEventListener("click", () => {
  if (!inputTitle.value || !inputDescription.value) {
    alert("لطفا عنوان و توضیحات را وارد نمایید");
    return;
  }
  console.log("layer", layer.getSource().getFeatures());
  let faeture = layer.getSource().getFeatures()[0];
  // faeture.setProperties({'123':inputTitle.value,'type':100});
  faeture.set("inputTitle", inputTitle.value);
  faeture.set("inputDescription", inputDescription.value);
  points.push(faeture);
  layer.getSource().clear();
  inputTitle.value = "";
  inputDescription.value = "";
});

inputShow.addEventListener("click", () => {
  map.removeInteraction(draw);
  layer.getSource().addFeatures(points);
  map.getView().fit(source.getExtent(), map.getSize());
});

map.on("click", (e) => {
  map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
    if ((feature, layer)) {
      let titleValue = feature.get("inputTitle");
      let descriptionValue = feature.get("inputDescription");
        popupContent.innerHTML = `<div>نوع صنف : ${titleValue}</div><div>توضیحات : ${descriptionValue}</div>`;
        let coordinate = e.coordinate;
        overlay.setPosition(coordinate);
      
      console.log(
        `titleValue==========${titleValue}  descriptionValue===========${descriptionValue}`
      );
    }
    // console.log("feature.get(type)",feature.get("type") );
    console.log("feature", feature);
    console.log("layer", layer);
  });
});
