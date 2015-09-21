(function() {
  function randomString4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  function openPhotoSwipe(imageSrcList, index) {
    var images = imageSrcList.map(function(source) {
      return { src: source, w:200, h:200};
    });

    var pswpElement = document.querySelectorAll('.pswp')[0];

    var options = {
      index: index,
      showHideOpacity: true
    };

    var pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, images, options);

    pswp.listen('imageLoadComplete', function(index, item) {
      var img = new Image();
      img.onload = function () {
        item.w = img.naturalWidth;
        item.h = img.naturalHeight;
        pswp.updateSize(true);
      }
      img.src = item.src;
    });

    pswp.init();
  };

  //eg. "https://drive.google.com/folderview?id=0B8JCaRF4U5MLSnRUZ0dxdVdtcTA&usp=sharing"
  function getImageUrlsForFolder(googleDriveLink, onComplete) {
    var parser = document.createElement('a');
    parser.href = googleDriveLink;

    var folderIdRegex = /id=([^&]*)/;
    var driveFolderId = folderIdRegex.exec(parser.search)[1];
    var folderUrl = 'https://googledrive.com/host/' + driveFolderId + '/';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var filenameRegex = new RegExp('<a href="/host/' + driveFolderId + '/(.*?)">', 'g');
        var imageUrls = [];
        var matchResult = [];
        while (matchResult = filenameRegex.exec(xhr.responseText)) {
          imageUrls.unshift(folderUrl + matchResult[1]);
        }
        onComplete(imageUrls);
      }
    }
    xhr.open('GET', folderUrl, true);
    xhr.send(null);
  };

  var galleries = document.querySelectorAll('.gallery');
  for (var i = 0; i < galleries.length; ++i) {
    var gallery = galleries[i];
    (function (gallery) {
      var msnry = new Masonry(gallery, {
        itemSelector: '.grid-item',
        columnWidth: 5
      });

      getImageUrlsForFolder(gallery.getAttribute('data-drive-link'), function(imageUrls) {
        imageUrls.forEach(function(imageUrl, index) {
          var thumb = document.createElement('img');
          thumb.onload = function() {
            msnry.layout();
          };
          thumb.src = imageUrl;
          var anchor = document.createElement('a');
          anchor.href = imageUrl;
          anchor.appendChild(thumb);
          var div = document.createElement('div');
          div.className = 'grid-item';
          div.appendChild(anchor);
          gallery.appendChild(div);
          msnry.appended(div);
          div.onclick = function() {
            openPhotoSwipe(imageUrls, index);
            return false;
          };
        });
      });
    })(gallery);
  };
})();


