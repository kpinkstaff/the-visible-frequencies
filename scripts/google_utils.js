(function(exports) {
  exports.getThumbUrl = function(imageUrl, maxWidth) {
    return 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url='
      + encodeURIComponent(imageUrl) + '&resize_w=' + maxWidth + '&refresh=43200'; // 12hr cache
  };

  exports.getDriveUrl = function(assetId) {
    return 'https://googledrive.com/host/' + assetId + '/';
  };

  exports.getDriveFolderId = function(folderShareLink) {
    var parser = document.createElement('a');
    parser.href = folderShareLink;
    var folderIdRegex = /id=([^&]*)/;
    return folderIdRegex.exec(parser.search)[1];
  };

  exports.getPlainUrlFromFileShareLink = function(fileShareLink) {
    var parser = document.createElement('a');
    parser.href = fileShareLink;
    var fileId = parser.pathname.split('/')[3];
    return exports.getDriveUrl(fileId);
  };

  exports.getImageUrlsForFolder = function(googleDriveLink, onComplete) {
    var driveFolderId = exports.getDriveFolderId(googleDriveLink);
    var folderUrl = exports.getDriveUrl(driveFolderId);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var filenameRegex = new RegExp('<a href="/host/' + driveFolderId + '/(.*?)">', 'g');
        var imageUrls = [];
        var matchResult = [];
        while (matchResult = filenameRegex.exec(xhr.responseText)) {
          var imageUrl = folderUrl + matchResult[1];
          imageUrls.push(imageUrl);
        }
        onComplete(imageUrls);
      }
    }
    xhr.open('GET', folderUrl, true);
    xhr.send(null);
  };
})(window.googleUtils = {});