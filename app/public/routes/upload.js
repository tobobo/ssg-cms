const qwest = require('qwest');

module.exports = app => {
  app.router.add('/edit/upload', () => {
    const socket = app.socket;
    const buildInfo = document.querySelectorAll('.js-build-info')[0];
    const uploadButton = document.querySelectorAll('input[type=submit]')[0];
    const concatBuildInfo = text => buildInfo.innerHTML += text;
    uploadButton.addEventListener('click', e => {
      e.preventDefault();
      buildInfo.innerHTML = '';
      qwest.post(window.location.pathname);
    });
    socket.on('build_start', () => concatBuildInfo('build start\n'));
    socket.on('build_upload_start', () => concatBuildInfo('upload start\n'));
    socket.on('build_stdout', concatBuildInfo);
    socket.on('build_stderr', concatBuildInfo);
    socket.on('build_complete', url => concatBuildInfo(`build complete. ${url}\n`));
  });
};
