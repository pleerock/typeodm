var gulp = require('gulp');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
var del = require('del');
var plumber = require('gulp-plumber');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var shell = require('gulp-shell');

gulp.task('clean', function (cb) {
    return del(['./build/**'], cb);
});

gulp.task('compile', function() {
    var tsProject = ts.createProject('./tsconfig.json', {
        sortOutput: true,
        typescript: require('typescript')
    });
    return tsProject.src()
        .pipe(plumber())
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest('./build/es6'));
});

gulp.task('tsd', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            './node_modules/.bin/tsd install',
            './node_modules/.bin/tsd rebundle',
            './node_modules/.bin/tsd link'
        ]));
});

gulp.task('build-package-copy-src', function() {
    return gulp.src('./build/es5/src/**/*')
        .pipe(gulp.dest('./build/package'));
});

gulp.task('build-package-copy-files', function() {
    return gulp.src(['./package.json', './README.md'])
        .pipe(gulp.dest('./build/package'));
});

gulp.task('build-package-generate-dts', function () {
    var fs = require('fs');
    function getFiles (dir, files){
        files = files || [];
        var filesInDir = fs.readdirSync(dir);
        for (var i in filesInDir){
            var name = dir + '/' + filesInDir[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name, files);
            } else {
                files.push(name);
            }
        }
        return files;
    }

    var dtsGenerator = require('dts-generator').default;
    var name = require('./package.json').name;
    var files = getFiles('./src');
    dtsGenerator({
        name: name,
        baseDir: './src',
        files: files,
        out: './build/package/index.d.ts'
    });
});

gulp.task('tests-integration', function () {
    return gulp.src('./build/es5/test/integration/**/*.js')
        .pipe(mocha())
});

gulp.task('tests-unit', function () {
    return gulp.src('./build/es5/test/unit/**/*.js')
        .pipe(mocha())
});

gulp.task('toes5', function () {
    return gulp.src('./build/es6/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./build/es5'));
});

gulp.task('run-sample1', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample1-simple-document/app.js'
        ]));
});

gulp.task('run:sample1', function (cb) {
    return runSequence('build', 'run-sample1', cb);
});

gulp.task('run-sample2', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample2-custom-document-name/app.js'
        ]));
});

gulp.task('run:sample2', function (cb) {
    return runSequence('build', 'run-sample2', cb);
});

gulp.task('run-sample3', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample3-working-with-documents/app.js'
        ]));
});

gulp.task('run:sample3', function (cb) {
    return runSequence('build', 'run-sample3', cb);
});

gulp.task('run-sample4', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample4-embedded-documents/app.js'
        ]));
});

gulp.task('run:sample4', function (cb) {
    return runSequence('build', 'run-sample4', cb);
});

gulp.task('run-sample7', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample7-initialize-and-persist/app.js'
        ]));
});

gulp.task('run:sample7', function (cb) {
    return runSequence('build', 'run-sample7', cb);
});

gulp.task('run-sample8', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample8-document-with-custom-id/app.js'
        ]));
});

gulp.task('run:sample8', function (cb) {
    return runSequence('build', 'run-sample8', cb);
});

gulp.task('run-sample9', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample9-mapped-ids/app.js'
        ]));
});

gulp.task('run:sample9', function (cb) {
    return runSequence('build', 'run-sample9', cb);
});

gulp.task('run-sample10', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample10-collections-prefix/app.js'
        ]));
});

gulp.task('run:sample10', function (cb) {
    return runSequence('build', 'run-sample10', cb);
});

gulp.task('run-sample11', function() {
    return gulp.src('*.js', { read: false })
        .pipe(shell([
            'node ./build/es5/sample/sample11-using-container/app.js'
        ]));
});

gulp.task('run:sample11', function (cb) {
    return runSequence('build', 'run-sample11', cb);
});

gulp.task('run:tests', function (cb) {
    return runSequence('build', /*'tests-unit', */'tests-integration', cb);
});

gulp.task('build', function(cb) {
    return runSequence('compile', 'toes5', cb);
});

gulp.task('package', function(cb) {
    return runSequence(
        'default',
        ['build-package-copy-src', 'build-package-copy-files', 'build-package-generate-dts'],
        cb
    );
});

gulp.task('default', function(cb) { return runSequence('clean', 'tsd', 'build', cb) });