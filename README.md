# Multi-Currency Investment Module

A secure multi-currency investment module built with NestJS, TypeScript, Sequelize, and other robust technologies. This project simulates real-world financial operations including currency conversion, ROI calculation, and dynamic payment gateway integration. It emphasizes precision, security, and scalability.

## Architecture Overview

The project follows a modular design using NestJS. Key components include:

- Authentication Module:  
  Implements JWT-based authentication and a mock login endpoint for secure access.

- Transaction Module:  
  Handles investment transactions with support for multiple currencies (USD, EUR, GBP), currency conversion using Decimal.js for precision, and ROI calculations.

- Payment Module:  
  Provides a dynamic payment gateway interface that initially integrates with MOYASAR but can be extended to support additional providers. Uses a common interface and dependency injection for flexibility.

- Database Integration:  
  Uses Sequelize ORM with PostgreSQL for data persistence. Models include `User`, `Transaction`, and `Payment` with properly defined associations (one-to-one between Transaction and Payment).

- Dockerization:  
  The app is containerized with Docker and Docker Compose for consistent deployment across environments, complete with health checks and environment configuration.

- Testing:  
  Unit tests are written using Jest to cover core business logic and API endpoints.

This architecture ensures a clean separation of concerns and facilitates future scalability and maintenance.

## Demo

[View Demo](https://demo.example.com)  
_(Insert demo GIF or video link below)_

![Demo GIF](https://example.com/path-to-demo.gif)

## Features

✅ Multi-currency support (USD/EUR/GBP)
✅ Dynamic payment provider selection
✅ Automatic retry (3 attempts with exponential backoff)
✅ Secure data handling (HashUtil for sensitive data)
✅ Swagger documentation at /api
✅ Dockerized deployment
✅ KYC verification endpoint

## Environment Variables

To run this project, add the following environment variables to your `.env` file:

API_KEY=your_api_key_here  
ANOTHER_API_KEY=your_another_api_key_here

# Database Configuration

DB_HOST=your_db_host  
DB_PORT=5432  
DB_USERNAME=your_db_username  
DB_PASSWORD=your_db_password  
DB_NAME=investments

# JWT Configuration

JWT_SECRET=your_jwt_secret

# Payment Providers

DEFAULT_PAYMENT_PROVIDER=MOYASAR  
MOYASAR_API_KEY=test_key  
STRIPE_API_KEY=test_key  
PAYPAL_CLIENT_ID=test_id  
PAYPAL_CLIENT_SECRET=test_secret

## Installation and Setup

1. Clone the Repository:

```bash git clone https://github.com/yourusername/multi-currency-investment-module.git
   cd multi-currency-investment-module
```

2. Install Dependencies:

```bash
  npm install
```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the required environment variables as shown above.

4. Run the Application:
   For development:

```bash
   npm run start:dev
```

For production:

```bash npm run build
   npm run start:prod
```

5. Using Docker:
   Build and run the Docker container using Docker Compose:

```bash
  docker-compose up --build
```

## Documentation

Swagger documentation is available at:  
http://localhost:3000/api (after running the application)

## API Reference

### Initiate Investment

POST /invest  
Authorization: Bearer <token>  
Content-Type: application/json

Request Body Example:

```javascript
{
"amount": 10000,
"currency": "EUR",
"durationMonths": 12,
"providerName": "MOYASAR"
}
```

Successful Response:

```javascript
{
"transactionId": "TRX-12345",
"convertedAmount": "10800.00",
"roiPercentage": "10.00",
"paymentStatus": "COMPLETED",
"paymentId": "MSR-1717047200000-1234",
"maturityDate": "2025-06-01"
}
```

### Verify Payment

GET /payments/{paymentId}  
Authorization: Bearer <token>

## Testing

Run unit tests using Jest:
npm run test

Ensure your test environment is correctly configured with the necessary environment variables.

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)  
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)  
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Appendix

Additional Information:

- Payment Providers:  
  Moyasar (80% success rate), Stripe (85%), PayPal (75%) with simulated delays.

- Security:  
  Input validation with class-validator, secure logging with sensitive data hashing.

- Retry Logic:  
  Automatic retry with exponential backoff (3 attempts max).

## License

This project is licensed under the MIT License. See the LICENSE file for details.
