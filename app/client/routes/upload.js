const qwest = require('qwest');

module.exports = app => {
  app.router.add('/edit/upload', () => {
    const socket = app.socket;
    const buildInfo = document.querySelector('.js-build-info');
    const uploadButton = document.querySelector('input[type=submit]');
    const concatBuildInfo = text => buildInfo.innerHTML += text;
    uploadButton.addEventListener('click', e => {
      e.preventDefault();
      buildInfo.innerHTML = '';
      qwest.post(window.location.pathname)
        .catch((err, xhr, response) => {
          console.log('response', response);
          if (xhr.status === 400) {
            app.flash('warning', 'No changes to upload');
          } else {
            app.flash('error', 'Upload error :(');
          }
        });
    });
    socket.on('build_start', () => concatBuildInfo('build start\n'));
    socket.on('build_upload_start', () => concatBuildInfo('upload start\n'));
    socket.on('build_stdout', concatBuildInfo);
    socket.on('build_stderr', concatBuildInfo);
    socket.on('upload_complete', () => concatBuildInfo(`upload complete\n`));
    socket.on('build_complete', url => {
      concatBuildInfo(`build complete. ${url}\n`);
      app.flash(
        'success',
        `build complete! check it out at <a href="${url}" target="_blank">${url}</a>`
      );
    });
  });
};
