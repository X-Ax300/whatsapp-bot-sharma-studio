# WhatsApp Chatbot with Session Management

A modular WhatsApp chatbot built with Node.js and Express that maintains user sessions and provides menu-based interactions.

## Features

- WhatsApp webhook integration
- Session management for tracking conversations
- Menu-based conversation flows
- Modular and maintainable architecture
- Comprehensive error handling and logging

## Project Structure

```
├── src/
│   ├── config/           # Application configuration
│   ├── controllers/      # Business logic
│   ├── data/             # Response templates and static data
│   ├── routes/           # API routes
│   ├── services/         # External service integrations
│   ├── utils/            # Utility functions
│   └── index.js          # Application entry point
├── .env.example          # Example environment variables
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your WhatsApp API credentials
4. Start the development server: `npm run dev`

## Environment Variables

- `VERIFY_TOKEN`: Your custom verification token for the WhatsApp webhook
- `ACCESS_TOKEN`: Your WhatsApp Business API access token
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (options: error, warn, info, debug)

## API Endpoints

- `GET /`: Health check endpoint
- `GET /webhook`: WhatsApp webhook verification endpoint
- `POST /webhook`: WhatsApp incoming message webhook

## WhatsApp Integration

This bot is designed to work with the WhatsApp Business API. You'll need to:

1. Set up a WhatsApp Business account
2. Configure the webhook URL to point to your deployed application
3. Use the same `VERIFY_TOKEN` in your environment and in the WhatsApp webhook configuration

## Development

Run the development server with hot reloading:

```
npm run dev
```

## Production Deployment

For production deployment:

```
npm start
```

## License

MIT