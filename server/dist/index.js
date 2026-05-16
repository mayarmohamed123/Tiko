import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tiko API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Tiko Full-Stack Application',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Routes
app.use('/api/auth', authRoutes);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
