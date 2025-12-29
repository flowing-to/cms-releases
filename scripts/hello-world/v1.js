window.flowing = window.flowing || {};
window.flowing["hello-world"] = {
  run(config) {
    var target = document.getElementById("preview-target");
        if (!target) return;
        target.innerHTML = "<h1 style=\"color: " + config.color + "\">" + config.message + "</h1>";
  }
};
