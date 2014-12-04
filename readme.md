#Front-End
###A simple start for static front-end development
<hr>
Front-End utilizes:

 - Gulp
 - Sass (.scss)
 - Autoprefixer
 - Bower
 - Dynamic HTML templates via `gulp-file-include`

It will also minify and concatenate the things that need minification and concatenation. **Fancy!**

##Requirements
* [Node.JS](http://nodejs.org/)
* [Gulp](http://gulpjs.com/)

##Installation
**Install Gulp globally**
`$ npm install -g gulp`

**Install package dependencies.**
`$ npm install`

**If you run into permissions errors:**
`$ sudo npm install`

**To start the server:**
`$ gulp watch`

##Templates

Use `@@include()` to include files.
```html
<!DOCTYPE html>
<html>
  <body>
  @@include('./src/_templates/_head.html')
  </body>
</html>
```