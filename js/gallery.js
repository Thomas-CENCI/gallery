/**
 * Config file. Contains all of the options for laying out the photos, as well
 * as the albums and photo metadata.
 */
class Config {
  constructor(config, opts) {
    this.data = config;
    this.maxHeight = opts.maxHeight || 400;
    this.spacing = opts.spacing || 10;
  };

  photos(album) {
    return this.data[album];
  }

  thumbnail(album) {
    if (this.data[album].some(photo => photo.thumbnail)) {
      return photo;
    }
    return this.data[album][0];
  }
}

/**
 * Abstract class for rendering a layout.
 */
class Renderer {
  constructor(domId) {
    this._rootElem = document.getElementById(domId);
    var bounds = this._rootElem.getBoundingClientRect();
    this._currentWidth = bounds.right - bounds.left;
  }

  render() {}

  getPhotos(photos) {
    var photos = photos.map((p) => { return new Photo(p); });
    return photos
  }

  rootElem() {
    return this._rootElem;
  }

  createHeader(title) {
    var sectionElem = document.createElement('section');
    sectionElem.id = title;
    var header = document.createElement('h3');
    header.innerHTML = title;
    sectionElem.appendChild(header);
    return sectionElem;
  }

  createImageElement(photo, width, height, spacing) {
    var image = new Image();

    image.style.width = width;
    image.style.height = height;
    image.style.marginBottom = spacing;
    image.onload = onImageLoad;
    image.setAttribute("data-action", "zoom");

    if (photo.isCompressed()) {
      // Lazy loading + a compressed image
      image.setAttribute("data-original", photo.originalSrc());
      image.setAttribute("data-src", photo.compresedSrc());
      image.src = photo.placeholderSrc();
      image.classList.add('lazyload');
    } else {
      // Original
      image.src = photo.src();
    }

    return image;
  }
}

/**
 * Renders the photos in rows
 */
class HorizontalRenderer extends Renderer {
  render(config) {
    for (var section in config.data) {
      var section = this.createSection(config,
        section,
        this.getPhotos(config, config.photos(section)));
      this.rootElem().appendChild(section);
    }
  }

  toggleView(elem) {
    var imagesDiv = elem.getElementsByTagName('div')
    for (var child of imagesDiv) {
      if (child.style.display === "none") {
        child.style.display = "block";
      }
      else {
        child.style.display = "none";
      }
    }
  }

  /**
   * Creates an album section
   */
  createSection(config, section, photos) {
    var sectionElem = this.createHeader(section);
    sectionElem.getElementsByTagNames('h3')[0].onclick(toggleView);

    while (photos.length > 0) {
      var maxWidth = config.spacing * -1;
      var rowPhotos = [];

      while (true) {
        var photo = photos.pop();
        maxWidth += photo.width(config.maxHeight) + config.spacing;
        rowPhotos.push(photo);
        if (maxWidth - config.spacing > this._currentWidth) {
          sectionElem.appendChild(this.createRow(config, section, rowPhotos));
          break;
        }

        if (photos.length === 0) {
          sectionElem.appendChild(this.createRow(config, section, rowPhotos, true));
          break;
        }
      }
    }

    return sectionElem;
  }

  /**
   * Creates a row of photos with fixed height
   */
  createRow(config, section, photos, isIncomplete=false) {
    var rowElem = document.createElement('div');
    rowElem.className = 'sectionrow';
    rowElem.style.marginBottom = px(config.spacing);

    // Calculate height of element
    var targetWidth = this._currentWidth - (photos.length - 1) * config.spacing;
    var sumWidth = 0;
    for (var i in photos) {
      sumWidth += photos[i].width(config.maxHeight);
    }
    var aspectRatio = sumWidth / parseFloat(targetWidth);
    var finalHeight = config.maxHeight / aspectRatio;
    if (isIncomplete) {
      finalHeight = config.maxHeight;
      // If it barely reaches the max height, it looks like an error. So let's
      // just add a ton of padding by reducing the height of the row.
      if (sumWidth > targetWidth * 9 / 10) {
        finalHeight = config.maxHeight * 0.9;
      }
    }

    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var image = this.createImageElement(photo,
                                          px(photo.width(finalHeight)),
                                          px(finalHeight),
                                          px(0));

      if (i !== 0) {
        image.style.marginLeft = px(config.spacing);
      }

      rowElem.appendChild(image);
    }
    return rowElem;
  }
}


/**
 * Wrapper for a photo
 */
class Photo {
  constructor(p) {
    this.path = p.path;
    this._width = p.width;
    this._height = p.height;
    this._is_compressed = p.compressed;
    this.placeholder_path = p.placeholder_path;
    this.compressed_path = p.compressed_path;

    this.aspectRatio = this._width / parseFloat(this._height);
  };

  src() {
    return this.path;
  }

  isCompressed() {
    return this._is_compressed;
  }

  originalSrc() {
    return this.path;
  }

  compresedSrc() {
    return this.compressed_path;
  }

  placeholderSrc() {
    return this.placeholder_path;
  }

  width(height) {
    return height * this.aspectRatio;
  }

  height(width) {
    return width / this.aspectRatio;
  }
}

/**
 * Event listener. Enables photos to transition to full opacity.
 */
function onImageLoad() {
  this.classList.add('img-loaded');
}

/**
 * Utility class to avoid type coercion
 */
function px(size) {
  return size + 'px';
}
