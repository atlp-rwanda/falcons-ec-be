"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce api',
      description: 'E-commerce api docs ',
      version: '0.7.5'
    },
    schemes: ['HTTP', 'HTTPS'],
    // servers:[{
    //     url: process.env.SERVER_URL,

    // }],

    security: [{
      google_auth: []
    }],
    components: {
      securitySchemes: {
        google_auth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: process.env.AUTHORIZATION_URL
            }
          }
        }
      }
    }
  },
  apis: ['./src/documentation/*.js']
};
var _default = options;
exports["default"] = _default;
//# sourceMappingURL=index.js.map