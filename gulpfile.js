/* Создаем ряд переменных */
/* название папки с финальным проектом */
let project_folder = require('path').basename(__dirname);
/* название папки с рабочими файлами проекта */
let source_folder = "src";
/* переменная для подключения шрифтов в стили */
let fs = require('fs');

/* переменная которая будет содержать в себе пути к разным файлам и папкам */
let path = {

	/* путь куда gulp выгружает обработанные файлы */
	build: {

		/* путь .html файлов */
		html: project_folder + "/",
		/* путь .css файлов */
		css: project_folder + "/css/",
		/* путь .js файлов */
		js: project_folder + "/js/",
		/* путь img файлов */
		img: project_folder + "/img/",
		/* путь fonts файлов */
		fonts: project_folder + "/fonts/",
		/* путь к папке с дополнениями apps */
		apps: project_folder + "/apps/",
	},
	/* путь куда gulp выгружает рабочии файлы */
	src: {

		/* путь .html файлов */
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		/* путь style.scss файлов */
		css: source_folder + "/scss/style.scss",
		/* путь main.js файлов */
		js: source_folder + "/js/*.js",
		/* путь картинки с расширением jpg,png,svg,gif,ico,webp файлов */
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		/* путь fonts c расширением ttf файлов */
		fonts: source_folder + "/fonts/*.ttf",
		/* путь в папку css */
		coppyCss: source_folder + "/css/*.css",
		/* путь к папке с дополнениями apps */
		apps: source_folder + "/apps/**/*.*",
	},
	/* путь куда gulp выгружает файлы которые он отслеживает*/
	watch: {

		/* путь html файлов */
		html: source_folder + "/**/*.html",
		/* путь .scss файлов */
		css: source_folder + "/scss/**/*.scss",
		/* путь main.js файлов */
		js: source_folder + "/js/**/*.js",
		/* путь картинки с расширением jpg,png,svg,gif,ico,webp файлов */
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		/* путь .css файлов */
		coppyCss: source_folder + "/css/**/*.css",
		/* путь к папке mailer */
		apps: project_folder + "/apps/**/*.*",
	},

	/* путь удаление папки при каждом запуске Gulp */
	clean: "./" + project_folder + "/"

}

/*  */
let { src, dest } = require('gulp'),
	/* переменная для дополнение gulp */
	gulp = require('gulp'),
	/* переменная для дополнение browser-sync */
	browsersync = require('browser-sync').create(),
	/* переменная для дополнения gulp-file-include */
	fileinclude = require('gulp-file-include'),
	/* переменная для дополнения del */
	del = require('del'),
	/* переменная для дополнения gulp-sass */
	scss = require('gulp-sass'),
	/* переменная для дополнения gulp-autoprefixer */
	autoprefixer = require('gulp-autoprefixer'),
	/* переменная для дополнения gulp-autoprefixer */
	group_media = require('gulp-group-css-media-queries'),
	/* переменная для дополнения gulp-clean-css  */
	clean_css = require('gulp-clean-css'),
	/* переменная для дополнения gulp-rename  */
	rename = require('gulp-rename'),
	/* переменная для дополнения gulp-uglify-es */
	uglify = require('gulp-uglify-es').default,
	/* переменная для дополнения gulp-imagemin */
	imagemin = require('gulp-imagemin'),
	/* переменная для дополнения gulp-ttf2woff */
	ttf2woff = require('gulp-ttf2woff'),
	/* переменная для дополнения gulp-ttf2woff2 */
	ttf2woff2 = require('gulp-ttf2woff2'),
	/* переменная для дополнения gulp-fonter */
	fonter = require('gulp-fonter');




/* Функция для обновления страницы */
function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

/* Функция для работы с html файлами */
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

/* Функция для оброботки css файлов*/
function css() {
	return src(path.src.css)
		.pipe(
			scss({
				/* метот сжатия scss */
				outputStyle: "expanded"
			})
		)
		.pipe(
			group_media()
		)
		.pipe(
			/* настройки для автопрефикса */
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			}))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

/* Функция для копирования папки css */
function coppyCss() {
	return src(path.src.coppyCss)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
}

/* Функция для работы с javascript файлами */
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

/* Функция для работы с img файлами */
function images() {
	return src(path.src.img)
		/* настройка сжатия картинок */
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3, /* указываем как сильно нужно сжать изображение (0 to 7) */
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

/* Функция для работы с шрифтами */
function fonts(params) {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

/* Функция для конвертации шрифтов формата otf в ttf */
gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'))
})



/* функция которая отвечает за запись и подключение шрифтов к файлу стилей */
function fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() { }

/* фуркция для копирования папки с ее содержимым */
function coppyDir() {
	return src(path.src.apps)
		.pipe(dest(path.build.apps))
}


/* Функция для отслеживания изменений */
function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.coppyCss], coppyCss);
}



/* Функция для удаления папки при каждом запуске Gulp*/
function clean(params) {
	return del(path.clean);
}






/* переменная для отслеживания (дружба между Gulp и переменными) */
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, coppyCss,coppyDir), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.coppyDir = coppyDir;
exports.coppyCss = coppyCss;
exports.fontsStyle = fontsStyle;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;