(function(googleUtils) {
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

  var galleries = document.querySelectorAll('.gallery');
  for (var i = 0; i < galleries.length; ++i) {
    (function (gallery) {
      var msnry = new Masonry(gallery, {
        itemSelector: '.grid-item',
        columnWidth: 10
      });

      googleUtils.getImageUrlsForFolder(gallery.getAttribute('data-drive-link'), function(imageUrls) {
        imageUrls.forEach(function(imageUrl, index) {
          var thumb = document.createElement('img');
          thumb.onload = function() {
            msnry.layout();
          };
          var thumbSrc = googleUtils.getThumbUrl(imageUrl, 240);
          thumb.src = thumbSrc;
          var anchor = document.createElement('a');
          anchor.href = imageUrl;
          anchor.appendChild(thumb);
          var div = document.createElement('div');
          div.className = 'grid-item';
          div.appendChild(anchor);
          gallery.appendChild(div);
          msnry.appended(div);
          msnry.layout();
          div.onclick = function() {
            openPhotoSwipe(imageUrls, index);
            return false;
          };
        });
      });
    })(galleries[i]);
  };
})(googleUtils);


