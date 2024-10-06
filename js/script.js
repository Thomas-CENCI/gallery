var id = 'gallery';

function reqListener() {
  var renderer = new HorizontalRenderer(id);
  var config = new Config(JSON.parse(this.responseText), configuration);
  renderer.render(config);
  lazyload();
}


window.onload = function() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "config.json");
  oReq.send();
};
