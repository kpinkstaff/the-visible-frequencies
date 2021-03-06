(function(googleUtils) {
  function randomString4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  function openPhotoSwipe(imageInfos, galleryUid, index) {
    var pswpItems = imageInfos.map(function(imageInfo) {
      var inGallerySize = {};
      var cacheOptions = {};
      if(imageInfo.thumbWidth > imageInfo.thumbHeight) {
        cacheOptions.maxWidth = 1024;
        inGallerySize.width = 1024;
        inGallerySize.height = (1024 / imageInfo.thumbWidth) * imageInfo.thumbHeight;
      } else {
        cacheOptions.maxHeight = 768;
        inGallerySize.height = 768;
        inGallerySize.width = (768 / imageInfo.thumbHeight) * imageInfo.thumbWidth;
      }
      var cachedImageUrl = googleUtils.getCachedImageUrl(imageInfo.url, cacheOptions);
      return {
        src: cachedImageUrl,
        msrc: imageInfo.thumbUrl,
        w: imageInfo.fullWidth || inGallerySize.width,
        h: imageInfo.fullHeight || inGallerySize.height,
        pid: encodeURIComponent(imageInfo.url)
      };
    });

    var pswpElement = document.querySelectorAll('.pswp')[0];

    var getThumbBoundsFn = function(index) {
      if (imageInfos[index].thumbElement) {
        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        var rect = imageInfos[index].thumbElement.getBoundingClientRect();
        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
      } else {
        return { x:0, y:0, w:0 };
      }
    }

    var pswpOptions = {
      index: index,
      showHideOpacity: true,
      preload: [1,1],
      getThumbBoundsFn: getThumbBoundsFn,
      galleryUid: galleryUid,
      galleryPIDs: true,
      captionEl: false,
      shareEl: false
    };

    var pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, pswpOptions);

    pswp.listen('imageLoadComplete', function(index, item) {
      for(var i = 0; i < item.container.childNodes.length; ++i) {
        if(item.container.childNodes[i].src == item.src) {
          item.w = imageInfos[index].fullWidth = item.container.childNodes[i].naturalWidth;
          item.h = imageInfos[index].fullHeight = item.container.childNodes[i].naturalHeight;
          pswp.updateSize(true);
          break;
        }
      }
    });

    pswp.init();
  };

  function parseHash(hash) {
    var params = {};
    if(hash.length < 6) {
        return params;
    }
    var vars = hash.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
        if(!vars[i]) {
            continue;
        }
        var pair = vars[i].split('=');
        if(pair.length < 2) {
            continue;
        }
        params[pair[0]] = pair[1];
    }
    return params;
  };

  var hashArgs = parseHash(window.location.hash);

  var galleries = document.querySelectorAll('.gallery');
  for (var galleryId = 0; galleryId < galleries.length; ++galleryId) {
    (function (gallery) {
      var msnry = new Masonry(gallery, {
        itemSelector: '.grid-item',
        isFitWidth: true
      });

      googleUtils.getImageUrlsForFolder(gallery.getAttribute('data-drive-link'), function(imageUrls) {
        var imageInfos = imageUrls.map(function(imageUrl) {
          return {
            url: imageUrl,
            thumbUrl: googleUtils.getCachedImageUrl(imageUrl, { maxWidth: 240 }),
            thumbHeight: 240,
            thumbWidth: 240
          }
        });
        imageInfos.forEach(function(imageInfo, index) {
          var thumb = document.createElement('img');
          imageInfo.thumbElement = thumb;
          thumb.onload = function() {
            imageInfo.thumbHeight = thumb.naturalHeight;
            imageInfo.thumbWidth = thumb.naturalWidth;
            var anchor = document.createElement('a');
            anchor.href = imageInfo.url;
            anchor.appendChild(thumb);
            var div = document.createElement('div');
            div.className = 'grid-item';
            div.appendChild(anchor);
            gallery.appendChild(div);
            msnry.appended(div);
            msnry.layout();
            div.onclick = function() {
              openPhotoSwipe(imageInfos, galleryId, index);
              return false;
            };
          };
          thumb.src = imageInfo.thumbUrl;
        });

        if(hashArgs.gid == galleryId) {
          openPhotoSwipe(imageInfos, galleryId);
        }
      });

    })(galleries[galleryId]);
  };
})(googleUtils);


