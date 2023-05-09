//web dev server 8080
//node server dev 3000
//node server pro 8000

const simpleApp = {
    name: 'Tim\'s Home',
    src: 'C:\\Projects\\Github_apptimdev\\apptimdev.github.io'
}

const reactApp = {
    name: 'Tim\'s Home (React)',
    src: 'C:\\Projects\\Github_apptimdev\\ProjectReactWebpack\\dest'
}

const version_number = 'v2'

// if(process.env.NODE_ENV === 'production'){
//     config.mode = 'production'
// }else{
//     config.mode = 'development'
// }
const config = {
    production: {
        port: 8000,
        version: `production_${version_number}`,
        //public_url: '/react',
        api_url: '/api'
    },
    development: {
        port: 3000,
        version: `development_${version_number}`,
        //public_url: '/',
        api_url: '/api'
    }
}

module.exports = {
    version_number,
    config,
    simpleApp,
    reactApp
}