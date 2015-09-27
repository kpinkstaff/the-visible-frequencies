(function(exports) {
  exports.getCachedImageUrl = function(imageUrl, options) {
    var options = options || {};

    var url = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus';
    url += '&url=' + encodeURIComponent(imageUrl);
    if(options.maxWidth) {
      url += '&resize_w=' + options.maxWidth;
    }
    if(options.maxHeight) {
      url += '&resize_h=' + options.maxHeight;
    }
    var maxAgeSeconds = options.maxAgeSeconds || 60 * 60 * 24 *30; //30 day default
    url += '&refresh=' + maxAgeSeconds;
    return url;
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