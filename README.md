# CineNow Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

A comprehensive cinema management system built with NestJS, featuring movie management, seat booking, user authentication, and administrative tools.

## 🎯 Features

- **Movie Management**: Add, update, and manage movie listings
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Complete administrative control panel
- **Statistics & Analytics**: Detailed reports and insights
- **PostgreSQL Database**: Robust data management
- **RESTful API**: Well-structured API endpoints

## 🏗️ Project Structure

```
backend/
├── dist/                     # Compiled JavaScript files
├── node_modules/             # Dependencies
├── postgres/                 # PostgreSQL configuration
└── src/                      # Source code
    ├── auth/                 # Authentication module
    │   └── [auth logic]
    ├── config/               # Configuration files
    ├── Constant/             # Application constants
    ├── movies/               # Movie management module
    │   └── [movie logic]
    ├── seed/                 # Database seeding
    ├── test/                 # Test files
    ├── app.module.ts         # Main application module
    └── main.ts               # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Andrewsy1004/Back-CineNow.git>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.template .env
   ```
   Configure your environment variables in `.env`:
   ```env
   DATABASE_URL   = postgresql://username:password@localhost:5432/cinema_db
   JWT_SECRET     = your-jwt-secret
   PORT           = 3000
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL with Docker
   docker-compose up -d 
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

