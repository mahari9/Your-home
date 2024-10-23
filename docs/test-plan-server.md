## Test Plan for Server Side

### Introduction

- **Purpose:** Ensure all server-side functionalities work as expected by testing models, controllers, and utilities.

- **Scope:** Includes testing for models (user.js, agency.js, comment.js, post.js, blacklist.js), controllers (authcontroller.js, commentcontroller.js, postcontroller.js, errorcontroller.js), and utilities (Apperror.js, catchasync.js, generatJWT.js).

### Objectives

- Verify correctness of all server-side components.
- Identify and fix bugs or issues.
- Validate performance and error handling.

### Testing Approach

- **Unit Tests:** Mocha framework for server-side unit tests.
- **Integration Tests:** Test API endpoints using Postman.
- **Mock Data:** Use mock data for testing various scenarios.

### Test Environment

- **Setup:** Node.js environment, MongoDB database (use a test database to avoid impacting production data).
- **Data:** Use mock data for testing to ensure consistency and repeatability.

### Test Deliverables

- **Reports:** Test summary reports, defect reports, and test case execution logs.

### Test Case

#### 1. Authentication and Authorization

- **Register User**
  - Test valid registration.
  - Test registration with existing email.
  - Test registration with invalid data.
- **Login User**
  - Test valid login.
  - Test login with incorrect password.
  - Test login with unregistered email.
- **JWT Authentication**
  - Test endpoint access with valid JWT.
  - Test endpoint access without JWT.
  - Test endpoint access with expired JWT.

#### 2. Property Management

- **View Properties**
  - Test viewing all properties.
  - Test viewing properties with filters (price, post type, property type, location).
- **Create Property Post**
  - Test creating a property post with valid data.
  - Test creating a property post with missing required fields.
- **Delete Property Post**
  - Test deleting a property post.
  - Test deleting a non-existing property post.
- **Update Property Status**
  - Test marking a property as sold/rented.
  - Test updating status of a non-existing property.

#### 3. User and Agency Ratings

- **Rate User/Agency**
  - Test rating a user/agency.
  - Test rating with invalid data.
  - Test viewing ratings.

#### 4. Post Assessment

- **Inspect Posts**
  - Test viewing all active posts.
  - Test viewing successfully sold properties.

### Example Test Case

- **Test Case ID:** TC001
- **Component:** authcontroller.js
- **Test Case Description:** Verify user registration with valid data
- **Preconditions:** Server running, MongoDB connected
- **Steps:**
    - Send POST request to /register with valid user data
    - Verify response status is 201
    - Check response body for user creation confirmation
- **Expected Result:** User should be created successfully, and appropriate confirmation returned.

This test plan covers the critical functionalities of the server side, ensure everything runs smoothly. 