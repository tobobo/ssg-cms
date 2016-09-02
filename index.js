const config = require('./config');
const app = require('./app');

const PORT = config.port;

app.listen(PORT, () => console.log(`app listening on ${PORT}`));
app.get('startPreviewServer')();
