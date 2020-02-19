const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const dbName = 'tombola';
const configs = {
    'development': {
        'application': {
            'name': `${dbName}`,
            'domain': 'localhost',
            'port': 3000
        },
        'mongodb': {
            'url': `mongodb://localhost:27017/${dbName}`
        },
        'swagger': {
            'path': '/api-docs'
        }
    },
    'production': {
        'application': {
            'name': `${dbName}`,
            'domain': 'hushtech.co.uk',
            'port': 3000
        },
        'mongodb': {
            'url': `mongodb://localhost:27017/${dbName}`
        },
        'swagger': {
            'path': '/api-docs'
        }
    }
};

export const config = configs[environment];