// Load files

for (file in modFiles) {
    let script = document.createElement("script");
    script.setAttribute("src", "js/" + modFiles[file]);
    script.setAttribute("async", "false");
    document.head.insertBefore(script, document.getElementById("temp"));
}

