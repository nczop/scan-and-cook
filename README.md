# Scan and Cook

## About the Project

Scan and Cook is a web application that allows you to easily digitize paper recipes using artificial intelligence. No more lost recipe cards or manual transcribing - scan your recipes and access them anytime!

## Key Features

- Scan recipe cards using your phone
- Upload recipe files from your computer (drag and drop)
- Process scanned text into electronic format using AI
- Automatically categorize recipes (breakfast, lunch, desserts, etc.)
- Edit scanned recipes
- Save recipes in a database linked to your user account

## Technologies

- React 19
- React Router 7
- Tailwind CSS
- Supabase
- TypeScript
- Docker

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Docker (optional, for containerized deployment)
- Supabase account (for database and authentication)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/scan-and-cook.git
cd scan-and-cook
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Application in Development Mode

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

```bash
npm run build
# or
pnpm build
```

## Running in Docker Container

To build and run the application in a Docker container:

```bash
docker build -t scan-and-cook .
docker run -p 3000:3000 scan-and-cook
```

## Project Structure

```
scan-and-cook/
├── app/             # Application code
├── public/          # Static assets
├── Dockerfile       # Docker configuration
├── package.json     # Dependencies and scripts
└── ...
```

## Success Criteria

- 75% of recipes processed by AI are accepted by the user without major corrections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created for all cooking enthusiasts who value organization and convenience.
