(function (googleUtils) {
  var galleryThumbs = document.querySelectorAll('.gallery-thumb');
  for (var i = 0; i < galleryThumbs.length; ++i) {
    (function (galleryThumb) {
      var driveLink = galleryThumb.getAttribute('data-drive-link');
      var imageUrl = googleUtils.getPlainUrlFromFileShareLink(driveLink);
      galleryThumb.src = googleUtils.getCachedImageUrl(imageUrl, { maxWidth: 250 });
    })(galleryThumbs[i]);
  }
})(window.googleUtils);