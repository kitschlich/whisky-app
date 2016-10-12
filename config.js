exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://default:default@ds029793.mlab.com:29793/whisky-app' :
                            'mongodb://localhost/whisky-app-dev');
exports.PORT = process.env.PORT || 8080;
