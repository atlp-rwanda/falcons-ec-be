import swaggerJsdoc from 'swagger-jsdoc'

    const options = {
        definition:{
            openapi: '3.0.0',
            info: {
              title: 'E-commerce API',
              description: 'E-commerce  documentation ',
              version: '1.0.0',
            },
    
            servers:[{
                url:`http://localhost:${process.env.PORT}`,
            }]
        },
        apis: ['../routes/welcomeRoute.js']
    }
    
    const swaggerSpec = swaggerJsdoc(options)
   
export  {swaggerSpec}