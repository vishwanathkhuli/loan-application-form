# Loan Application Form

A modern React application for loan applications with dynamic form validation using JSON Schema.

## Features

- Multi-step form with intuitive navigation
- Client-side validation using AJV8
- Dynamic form fields based on user input (credit score)
- Format validation for GSTIN and PAN numbers
- Responsive design with Material UI

## Tech Stack

- React with TypeScript
- React JSON Schema Form (RJSF) with AJV8 validation
- Material UI for components
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install dependencies
```
cd loan-application
npm install
```

3. Start the development server
```
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Application Structure

- **src/components/forms**: Contains the individual form components
- **src/components/common**: Contains reusable UI components
- **src/pages**: Contains page-level components
- **src/schemas**: JSON Schema definitions for forms
- **src/types**: TypeScript type definitions
- **src/utils**: Utility functions
- **src/validation**: Custom validation logic

## Usage

1. Fill in the Business Details form
2. Navigate to the Loan Details form
3. If your credit score is below 700, additional fields for guarantors and bank statements will appear
4. Submit the application to receive confirmation

## License

MIT 