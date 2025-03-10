const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uspark Backend API",
      version: "1.0.0",
      description: "API documentation for Uspark backend services",
    },
    servers: [
      {
        url: "http://localhost:5001", // Change based on your deployed environment
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        FileUploadResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "File uploaded successfully" },
            fileUrl: {
              type: "string",
              example:
                "https://s3.amazonaws.com/bucket-name/verification-docs/doctor123/doc.pdf",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            userId: { type: "string", example: "65f4c3bdf1a3d7a9e9a4d8c2" },
            fullName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "johndoe@example.com" },
            provider: {
              type: "string",
              enum: ["local", "google.com", "apple.com"],
              example: "local",
            },
            role: {
              type: "string",
              enum: ["patient", "doctor"],
              example: "doctor",
            },
            isOnboarded: { type: "boolean", example: true },
            image: {
              type: "string",
              example: "https://s3.amazonaws.com/bucket-name/profile.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-08T12:34:56.789Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-08T12:35:56.789Z",
            },
          },
        },
        Patient: {
          type: "object",
          properties: {
            userId: { type: "string", example: "65f4c3bdf1a3d7a9e9a4d8c2" },
            age: { type: "integer", example: 30 },
            sex: { type: "string", enum: ["male", "female"], example: "male" },
            height: { type: "number", example: 175 },
            weight: { type: "number", example: 70 },
            healthIssues: {
              type: "string",
              example: "Diabetes, High blood pressure",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-08T12:34:56.789Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-08T12:35:56.789Z",
            },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            userId: { type: "string", example: "65f4c3bdf1a3d7a9e9a4d8c2" },
            specialization: { type: "string", example: "Cardiology" },
            experience: { type: "integer", example: 5 },
            certifications: { type: "string", example: "MBBS, MD" },
            verificationStatus: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending",
            },
            verificationDocs: {
              type: "array",
              items: { type: "string" },
              example: ["https://s3.amazonaws.com/bucket-name/doc1.pdf"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-08T12:34:56.789Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-08T12:35:56.789Z",
            },
          },
        },
        Insurance: {
          type: "object",
          properties: {
            userId: { type: "string", example: "65f4c3bdf1a3d7a9e9a4d8c2" },
            providerName: { type: "string", example: "Blue Cross Blue Shield" },
            startDate: {
              type: "string",
              format: "date",
              example: "2023-01-01",
            },
            endDate: { type: "string", format: "date", example: "2024-01-01" },
            holderName: { type: "string", example: "John Doe" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Include all route files for documentation
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
