export const formatJson = (value) => {
  var ugly = value.replace(/'/g, '"').replace(/\bNone\b(?!")/g, null);
  var obj = JSON.parse(ugly);
  var pretty = JSON.stringify(obj, undefined, 2);
  return pretty;
};

/**
 * Stores the the text in a local file. Usually the web browser determines where the file is stored (download folder).
 *
 * @param text The content of the file.
 * @param fileName The name of the target file (should not contain a path).
 */
export const saveTextAsFile = (text, fileName) => {
  const blob = new Blob([text], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL) {
    // No need to add the download element to the DOM in Webkit.
    downloadLink.href = window.webkitURL.createObjectURL(blob);
  } else {
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.onclick = (event) => {
      if (event.target) {
        document.body.removeChild(event.target);
      }
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();

  if (window.webkitURL) {
    window.webkitURL.revokeObjectURL(downloadLink.href);
  } else {
    window.URL.revokeObjectURL(downloadLink.href);
  }
};
