# Transport Manager Frontend (React App)

Written by Ni Yan for Queensland University of Technology, IFN666 Web and Mobile Application Development.


## 1.The purpose of the application.

The **Transport Manager** is a react-base web app that lets users manager drivers, vehicles and trips through a clean and easy-to-use interface. It connects to a backend API to fetch and update data, and is designed to help users interact with the system in a simiple and efficient way.
   

## 2.A description of how to contribute to the development of the application.
1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes and **commit** them with clear, descriptive commit messages. Make sure that you follow the existing code style and structure.
4. **Push** your changes to your forked repository.
5. Submit a **Pull Request (PR)** to the main repository.

Please ensure that your contributions follow the existing code style, include appropriate tests, and are well-documented.


## 3.A list of features
- **Driver Management**: Create, view, update, and delete driver records
- **Vehicle Management**: Create, view, update, and delete vehicle records
- **Trip Management**: Track trips with driver and vehicle assignment, locations and time
- **Search & filter**: easily search by name, licence number or trip details
- **Sorting & pagination**: sort lists by different fields and navigate pages
- **Multilingual support**: switch between English and Chinese
- **Input validation**: validate user input
- **Accessible UI**: built with Mantine UI for responsiveness and color contrast
- **Responsive design**: works well on desktop, tablet different screens


## 4.A list of dependencies and how to install them

- **react**: A JavaScript library for building user interfaces.
- **react-dom**: Provides DOM-specific rendering methods for React components.
- **react-router-dom**: Enables navigation and routing in single-page applications.
- **@mantine/core**: A modern component library providing UI elements like buttons, tables, and modals.
- **@mantine/hooks**: Custom React hooks designed to simplify state and UI logic with Mantine.
- **@mantine/dates**: Provides date pickers and calendar components, built on top of Mantine.
- **@mantine/notifications**: Enables in-app notification messages and alerts.
- **@emotion/react**: A performant CSS-in-JS styling library used under the hood by Mantine.
- **@emotion/styled**: A styled-components-compatible API for writing component styles.
- **@tabler/icons-react**: An icon library providing customizable SVG icons for UI elements.
- **dayjs**: A lightweight alternative to Moment.js for parsing, validating, and formatting dates.
- **cors**: Middleware for handling Cross-Origin Resource Sharing during development.

## 5.A description of the applications architecture

The **Transport Manager**  follows a **component-based architecture** using React. The app is structured for clarity and modularity, with different folders representing features and responsibilities：

- **Components**: Reusable UI components for form modals and interaction logic.
  - **Driver**: Contains DriverFormModal.jsx for creating or editing driver data.
  - **Vehicle**: Contains VehicleFormModal.jsx for managing vehicle records.
  - **Trip**: Contains TripFormModal.jsx for creating or updating trip records.
- **Pages**: Represent main views in the application.
  - **Home**：Landing page with introductory content.
  - **Driver.**: Page for viewing, filtering, sorting, and managing drivers.
  - **Vehicle**: Page for managing vehicles, including search and pagination.
  - **Trip**: Trip management page with filtering by driver/vehicle/date.
  - **About**: Information about the project.
  - **Layout**: Shared layout wrapper with navigation bar and routing outlet.
  - **NoPage**: Fallback page for unmatched routes.

### Folder Structure:

```
client/
├── public/
│   └── favicon.svg                   
├── src/
│   ├── assets/                      
│   ├── components/                  
│   │   ├── Driver/
│   │   │   └── DriverFormModal.jsx
│   │   ├── Trip/
│   │   │   └── TripFormModal.jsx
│   │   └── Vehicle/
│   │       └── VehicleFormModal.jsx
│   ├── contexts/
│   │   └── LanguageContext.jsx     
│   ├── pages/                       
│   │   ├── About.jsx
│   │   ├── Driver.jsx
│   │   ├── Home.jsx
│   │   ├── Layout.jsx
│   │   ├── NoPage.jsx
│   │   ├── Trip.jsx
│   │   └── Vehicle.jsx
│   ├── App.jsx                      
│   ├── main.jsx                     
│   ├── App.css                      
│   └── index.css                    
├── .env                             
├── .gitignore
├── index.html                       
├── package.json                     
├── package-lock.json
├── README.md
├── vite.config.js                   
├── eslint.config.js                 
```

## 6.How to report issues

If you encounter a bug, unexpected behavior, or have a suggestion for improvement, please follow these steps to report it:
1. **Check existing issues** before submitting a new issue to avoid duplicates.
2. **Create a new issue** if it hasn't been reported before. Here are the steps:
  - **Describe** the issue 
  - Steps to **reproduce** the issue
  - What you **expected to happen** and **actually happen**
  - Relavant **error messages** or **screenshots**
3. We will review your issue and let you know as soon as possible. 

