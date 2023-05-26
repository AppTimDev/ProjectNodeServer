//web dev server 8080
//node server dev 3000
//node server pro 8000
const version_number = 'v2'

const webApp = {
    name: 'Tim\'s Home',
    src: 'C:\\Projects\\Github_apptimdev\\apptimdev.github.io\\dest'
}

const webAppReact = {
    name: 'Tim\'s Home (React)',
    src: 'C:\\Projects\\Github_apptimdev\\ProjectReactWebpack\\dest'
}


const config = {
    production: {
        port: 8000,
        version: `production_${version_number}`,
        api_url: '/api'
    },
    development: {
        port: 3000,
        version: `development_${version_number}`,
        api_url: '/api'
    }
}

module.exports = {
    config,
    webApp,
    webAppReact
}