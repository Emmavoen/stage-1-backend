# HNG Stage 1: String Analyzer Service

This is a RESTful API service built for the HNG Internship (Stage 1). It analyzes strings, computes various properties, and stores the results in a MongoDB database.

## Features

* Analyzes strings for 6 different properties.
* Stores and retrieves analysis results.
* Provides advanced filtering based on computed properties.
* Offers a natural language endpoint for simple queries.

## Tech Stack

* **Server:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** MongoDB (with Mongoose)
* **Environment:** dotenv

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```

3.  **Install dependencies:**
    (This installs all dependencies listed in `package.json`)
    ```bash
    npm install
    ```

4.  **Create an environment file:**
    Copy the example environment file to a new `.env` file.
    ```bash
    cp .env.example .env
    ```

5.  **Update Environment Variables:**
    Open the `.env` file and add your configuration details. (See below)

---

## Environment Variables

This project requires the following environment variables to be set in your `.env` file:

* `PORT`: The port the server will run on (e.g., `8080`).
* `DATABASE_URL`: Your full MongoDB connection string.
    * *Example:* `mongodb://localhost:27017/hng-string-db` or a remote Atlas string.

---

## Running the Application

You can run the server in development or production mode.

### Development Mode

This command uses `nodemon` and `ts-node` to run the server. It will automatically restart when you save changes to a file.

```bash
npm run dev
```

### Production Mode

This command first builds the TypeScript code into plain JavaScript in the `/dist` folder, and then runs the built code.

```bash
# 1. Build the project
npm run build

# 2. Start the server
npm run start
```

The server will be running at `http://localhost:PORT`.

---

## API Documentation

You can test the endpoints using an API client like Postman or Insomnia.

### 1. Create/Analyze String

* **Endpoint:** `POST /strings`
* **Description:** Analyzes a new string and stores its properties.
* **Request Body:**
    ```json
    {
      "value": "A man, a plan, a canal: Panama"
    }
    ```
* **Success Response (201 Created):**
    Returns the full analysis object.
* **Error Responses:**
    * `400 Bad Request`: If the "value" field is missing.
    * `422 Unprocessable Entity`: If "value" is not a string.
    * `409 Conflict`: If a string with the same value (and hash) already exists.

### 2. Get Specific String

* **Endpoint:** `GET /strings/:string_value`
* **Description:** Retrieves the analysis for a specific string.
* **Example URL:** `GET /strings/racecar`
* **Success Response (200 OK):**
    Returns the stored analysis object.
* **Error Responses:**
    * `404 Not Found`: If the string does not exist in the system.

### 3. Get All Strings (with Filtering)

* **Endpoint:** `GET /strings`
* **Description:** Returns a list of all string analyses, with optional query parameters for filtering.
* **Query Parameters:**
    * `is_palindrome` (boolean): e.g., `?is_palindrome=true`
    * `min_length` (integer): e.g., `?min_length=10`
    * `max_length` (integer): e.g., `?max_length=50`
    * `word_count` (integer): e.g., `?word_count=2`
    * `contains_character` (string): e.g., `?contains_character=z`
* **Example URL:** `GET /strings?is_palindrome=true&min_length=3`
* **Success Response (200 OK):**
    Returns an object containing the `data` array, `count`, and `filters_applied`.
* **Error Responses:**
    * `400 Bad Request`: If any query parameter has an invalid type.

### 4. Natural Language Filtering

* **Endpoint:** `GET /strings/filter-by-natural-language`
* **Description:** Parses a natural language query to apply filters.
* **Query Parameter:**
    * `query` (string): The natural language query.
* **Example URL:** `GET /strings/filter-by-natural-language?query=all single word palindromic strings`
* **Success Response (200 OK):**
    Returns an object with the `data`, `count`, and the `interpreted_query`.
* **Error Responses:**
    * `400 Bad Request`: If the "query" parameter is missing.
    * `422 Unprocessable Entity`: If the query results in conflicting filters.

### 5. Delete String

* **Endpoint:** `DELETE /strings/:string_value`
* **Description:** Deletes a string analysis from the database.
* **Example URL:** `DELETE /strings/racecar`
* **Success Response (204 No Content):**
    Returns an empty body.
* **Error Responses:**
    * `404 Not Found`: If the string does not exist in the system.

---

## Testing

No formal testing framework (like Jest) is included in this build. The API endpoints should be tested manually using the documentation above and an API client like **Postman**.
