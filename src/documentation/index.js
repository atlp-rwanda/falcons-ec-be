export const options = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'E-commerce api',
          description: 'E-commerce api docs ',
          version: '0.7.5',
        },

        servers:[{
            url:"http://localhost:5000"
        }],
        schemes: ['HTTP', 'HTTPS'],

        security: [
         {
      google_auth: [],
    },
  ],
        components: {
            securitySchemes: {
                google_auth: {
                    type: 'oauth2',
                    flows: {
                      authorizationCode: {
                        authorizationUrl:
                          'http://localhost:5000/api/v1/users/auth/google/redirect',
                      },
                    },
                  },
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
        
    },
    apis:['./src/documentation/welcome.docs.js']

}