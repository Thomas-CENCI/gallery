# Gallery
A visual portfolio generator with web hosting for your mockups and photo albums. Requires no 3rd party libraries or installations. A free Squarespace alternative for your photos. Live demo at http://andyzhang.net/gallery.

This template has been forked from the following repository: https://github.com/andyzg/gallery

## Making your own gallery in less than 5 minutes
- Fork this repository
- Clone the repository through terminal by running
`git clone git@github.com:{YOUR_USERNAME}/gallery.git`
- Replace contents of `/photos` with all of your albums. For each of your albums, create a folder with the same name as your album name, and then put all of your photos in the folder. 
**Example**:
```
/photos
  /mockups
    IMG_0123.jpg
    IMG_0124.jpg
  /portrait
    IMG_1234.jpg
    IMG_1235.jpg
```

- Open the folder in finder and **run** `setup.command`. This will go through all of your albums and create a `config.json` file for you. This file allows the generator to know which photos will be hosted on your website.
- Personalize the contents at the bottom of `_config.yml`.
- Commit and push all of your changes to Github.
- Check out your site at {username}.github.io/gallery!

*Important notes:* To speed up the loading time of your gallery, please make sure to compress your images. If you're running this on a macOS system, this is done automatically for you using `sips`!