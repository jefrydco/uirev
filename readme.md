# uirev

## Overview
[Uirev](https://github.com/jefrydco/uirev) is a painless front-end boilerplate kit. It can make your developing experience more easy and fast.

### Features
| Feature | Summary                                                                                                                                                                                                                                                     |
|---------|---------|
| Responsive boilerplate | A responsive boilerplate optimized for the multi-screen web. Powered by [Twitter Bootstrap](http://getbootstrap.com). |
| Pug suppoprt | Compile [Pug](https://pugjs.org) into HTML with ease, write Pug syntax and mix it with Javascript to give more freedom. (Run `gulp pug` to compile)|
| Sass support | Compile [Sass](http://sass-lang.com/) into CSS with ease, bringing support for variables, mixins and more. (Run `gulp scss:dev` for developing or `gulp scss:build` for production) |
| Image compression | Never think about compressing your image manually, just copy your image into `assets/img` and it'll be compressed automatically. Thanks to [imagemin](https://github.com/imagemin/imagemin) for such a great tool. |
| ECMAScript 6 | Write in new generation of Javascript with a lot of [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar). |
| Live Browser Reloading | Reload the browser in real-time whenever you edit your file without any need of extension. Brought to you by [Browsersync](https://www.browsersync.io). (Run `npm run serve` for developing or `npm run build` for production) |

### Quickstart
Make sure you have installed **node.js** on your computer. [Download](https://github.com/jefrydco/uirev/releases/download/v0.1.0/uirev.zip)
the kit or clone this repository. Run `npm install` to make everything run smoothly. Then, build your project in `./src` directory.

To change between developing and production environment, take a look in `./src/pug/_env.pug`.
The default configuration is **dev** environment but you set it **true** if you wanna use production environment.

### Available Command

#### Font
* `gulp fonts` to copy all fonts in `./src/assets/scss/fonts` to `./dist/assets/fonts`.

#### Image
* `gulp img:hd` to optimize and resize all images in `./src/assets/img/hd` to resolution 1920 x auto. It also convert them into **.jpg** format.Then copy the result to `./dist/assets/img/hd`.
* `gulp img:md` to optimize and resize all images in `./src/assets/img/md` to resolution 1320 x auto. It also convert them into **.jpg** format. Then copy the result to `./dist/assets/img/md`.
* `gulp img:sm` to optimize all images in `./src/assets/img/sm` and copy the result to `./dist/assets/img/sm`. It doesn't resize and convert anything because I think small image usually used for background pattern, icon and logo.
* `gulp img` to run all of img command above.

#### JavaScript
* `gulp js:vendor-cp` to copy all JS vendor assets in `./src/assets/js/vendor/cp` to `./dist/assets/js`.
* `gulp js:dev-vendor` to convert all of vendor script into ECMAScript 5 then concat them into one file named **vendor.js** located in `./dist/assets/js`.
* `gulp js:dev` to convert **main.js** into ECMAScript 5 and it also run `js:vendor-cp` and `js:dev-vendor`.
* `gulp js:build` to convert all of vendor script and your **main.js** into ECMAScript 5 and concat them into one file named **vendor.min.js** located in `./dist/assets/js`.

#### SCSS
* `gulp scss:dev-vendor` to compile all SCSS vendor assets in `./src/assets/scss/vendor` to CSS files and place the output to `./dist/assets/css`. It also combine all separated media queries found in them.
* `gulp scss:dev` to compile all SCSS Vendor assets and your custom stylesheet and place the output to `./dist/assets/css`.
* `gulp scss:build-vendor`, it has same function as `gulp scss:dev-vendor` but the differences is it combine all SCSS files into one css file named **vendor.min.css** located in `./dist/assets/css`.
* `gulp scss:build`, it has same function as `gulp scss:dev`.

#### Pug
* `gulp pug` to compile and combile all pug files in `./src/pug` into one file named **index.html** located in `./dist`.

#### Helper
* `npm run clean` or `gulp clean` to clean your **dist** project directory.
* `npm run serve` or just `gulp` to run all of dev command above then serve it as localhost server.
* `npm run build` or `gulp build`, it has same function as `npm run serve` but the differences is it run all of build command.

### License
The content of this project itself is licensed under the [Creative Commons Attribution 3.0 license](http://creativecommons.org/licenses/by/3.0/us/deed.en_US), and the underlying source code used to format and display that content is licensed under the [MIT license](https://github.com/jefrydco/uirev/blob/master/LICENSE).