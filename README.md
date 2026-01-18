# Crime Analysis Dashboard

A comprehensive crime analytics web application built with React, Vite, and Tailwind CSS, featuring role-based dashboards, advanced filtering, and subscription plans for users and administrators.

## ✨ Key Features

### 🔍 Advanced Data Filtering
- **Dynamic Filtering**: Filter crime data by state, city, crime type, month, and year
- **Real-Time Updates**: All charts and metrics update instantly without page reloads
- **Smart City Filtering**: Cities are automatically filtered based on selected state
- **Dataset Validation**: All data comes directly from the uploaded `crime-data.json` file
- **No Mock Data**: Every visualization reflects actual filtered dataset values

### 👤 User Dashboard
- **Personalized Experience**: Store and load preferred state for quick access
- **Comprehensive Analytics**: Total crimes, crime types, states covered, and years of data
- **Interactive Visualizations**: Monthly/yearly trends, crime distribution, severity analysis
- **Geographic Insights**: State and city-level crime distribution
- **Environmental Analysis**: Weather conditions and location type correlations
- **Temporal Patterns**: Day of week and weekend vs weekday analysis
- **Left-Side Filter Panel**: Easy access to all filtering options

### 🛡️ Admin Dashboard
- **Advanced Analytics**: Case management, arrest statistics, response time analysis
- **Performance Metrics**: Police station performance tracking
- **Comprehensive Filtering**: Multi-filter support for precise data analysis
- **Offender Analysis**: Repeat offender and age group statistics
- **Crime Hotspots**: Identification of high-crime areas
- **Real-Time KPIs**: Closure rates, arrest rates, and average response times

### 💳 Subscription Plans

#### User Plan
- **Pricing**: ₹99/month or ₹999/year (Save 17%)
- **Features**:
  - Access to user dashboards
  - State-wise and city-wise filtered views
  - Read-only analytical insights
  - Monthly crime trends
  - Geographic analysis
- **Free Trial**: First 3 dashboard views with limited data range

#### Admin Plan
- **Pricing**: ₹299/month or ₹2999/year (Save 17%)
- **Features**:
  - Full dashboard access
  - Advanced analytics
  - User management
  - Data upload and updates
  - Real-time monitoring
  - Advanced filtering
  - Custom reports
  - Priority support

### 🔐 Security & Authentication
- **Firebase Integration**: Real authentication with email/password
- **Role-Based Access**: USER, ADMIN, and SUPER_ADMIN roles
- **User Preferences**: Stored in Firestore for personalized experience
- **Secure Data Storage**: Encrypted data with Firebase security rules

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Analytics**: Firebase Analytics

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Auth and Firestore enabled

### Installation

1. Navigate to the project directory:
```bash
cd d:/sp/crime
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Enable Email/Password authentication in Firebase Console
   - Create Firestore database
   - Update security rules (see Firebase Integration section)

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Project Structure

```
crime/
├── src/
│   ├── components/
│   │   ├── ChartCard.jsx       # Reusable chart container
│   │   ├── FilterPanel.jsx     # Advanced filtering component
│   │   ├── Layout.jsx          # Main layout with navbar
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── ProtectedRoute.jsx  # Route protection
│   │   └── StatCard.jsx        # Statistics card component
│   ├── config/
│   │   └── firebase.js         # Firebase configuration
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── About.jsx           # About page
│   │   ├── AdminDashboard.jsx  # Admin dashboard with filtering
│   │   ├── AdminSignup.jsx     # Admin registration
│   │   ├── Contact.jsx         # Contact page
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Login page
│   │   ├── Pricing.jsx         # Plans & pricing page
│   │   ├── SuperAdminPanel.jsx # Super admin panel
│   │   ├── UserDashboard.jsx   # User dashboard with filtering
│   │   └── UserSignup.jsx      # User registration
│   ├── utils/
│   │   └── dataUtils.js        # Data processing with filtering
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── crime-data.json             # Crime dataset (1M+ records)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Data Filtering System

### How It Works
1. **Data Source**: All data comes from `crime-data.json` (no mock or random data)
2. **Filter Application**: Filters are applied to the raw dataset before any analytics
3. **Dynamic Updates**: Charts update in real-time as filters change
4. **Validation**: Only states, cities, and values present in the dataset are shown

### Available Filters
- **State**: Select from all states in the dataset
- **City**: Dynamically filtered based on selected state
- **Crime Type**: All crime types from the dataset
- **Month**: All months with data (1-12)
- **Year**: All years present in the dataset

### Filter Functions
```javascript
// Get unique values
getUniqueStates()
getUniqueCities(state)
getUniqueCrimeTypes()
getUniqueMonths()
getUniqueYears()

// Apply filters to analytics
getTotalCrimes(filters)
getCrimesByType(filters)
getCrimesByState(filters)
// ... all analytics functions support filters
```

## User Roles

### USER
- Access to read-only dashboard
- View crime statistics and trends
- Filter by state, city, crime type, month, year
- Save preferred state
- No data modification capabilities

### ADMIN
- All USER features
- Advanced analytics and filtering
- Police station performance metrics
- Case management insights
- Data upload capabilities
- Region-specific access

### SUPER_ADMIN
- All ADMIN features
- System-wide management
- User administration
- Global configuration

## Firebase Integration

### Required Services
1. **Authentication**: Email/Password authentication
2. **Firestore**: User profiles, preferences, and contact messages
3. **Analytics**: Usage tracking and insights

### Firestore Collections
```
users/
  {userId}/
    - email
    - displayName
    - role (USER | ADMIN | SUPER_ADMIN)
    - region
    - preferences
      - preferredState
    - createdAt

contacts/
  {contactId}/
    - name
    - email
    - message
    - createdAt
```

### Security Rules
See `firebase_integration.md` for detailed security rules and setup instructions.

## Subscription Flow

1. **Visitor** → Views Plans & Pricing page
2. **Plan Selection** → Chooses User or Admin plan
3. **Signup/Login** → Creates account or logs in
4. **Dashboard Access** → Access granted based on subscription status
5. **Free Trial** → Limited to 3 dashboard views for User plan

## Key Improvements

### ✅ Data Validation
- All dashboards use `crime-data.json` as the ONLY data source
- No random or hardcoded values
- States, cities, and crime types extracted dynamically from dataset
- Dataset validation prevents rendering of invalid analytics

### ✅ Admin Dashboard Fixes
- Comprehensive filter panel (State, City, Crime Type, Month, Year)
- Real-time chart updates
- All states from dataset appear in filters
- Accurate aggregations from filtered data

### ✅ User Dashboard Enhancements
- Left-side filter panel
- State preference storage in Firestore
- Personalized default view based on user's state
- Simplified metrics for read-only access

### ✅ Plans & Pricing
- Pre-login pricing page
- User Plan: ₹99/month, ₹999/year
- Admin Plan: ₹299/month, ₹2999/year
- Free trial information
- Clear feature comparisons

### ✅ Content Enhancements
- **Home Page**: Enhanced mission, detailed benefits, AI insights mention
- **About Page**: Expanded methodology, use cases, security details
- **Navigation**: Added Pricing link

## Future Enhancements

- Real-time data updates
- Predictive analytics using ML
- Interactive map visualizations
- Export functionality for reports
- Advanced search capabilities
- Mobile app version
- API access for integrations

## License

This project is for educational and demonstration purposes.

## Support

For questions or issues, please contact us through the Contact page in the application.

---

**Built with ❤️ using React, Firebase, and modern web technologies**
"# new_one" 
