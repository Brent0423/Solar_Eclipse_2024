# Solar Eclipse Explorer Flask Application

The application identifies the closest viewing location for the 2024 Solar Eclipse by comparing the user's current location against a set of predefined coordinates. It calculates distances using the Haversine formula and selects the minimum distance to determine the closest point. This point is then displayed on a Google Map within the app, providing users with information and directions to the optimal viewing location. The process involves fetching the user's location, calculating distances, updating the app's state with the closest location, and visually representing this information on a map.
## Prerequisites

Before you begin, ensure you have Docker installed on your machine.

## Quick Start

Follow these steps to get the application running on your local machine:

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

git clone https://github.com/Brent0423/Solar_Eclipse_2024.git

### 2. Navigate to the Project Directory

Change into the project directory where the Dockerfile is located:

cd Solar_Eclipse_2024

### 3. Build the Docker Image

Build the Docker image using the following command: docker build -t solar-eclipse .

### 4. Run the Docker Container

Run the Docker container with the following command: docker run -p 8080:5000 solar-eclipse

### 5. Access the Application

Open your web browser and navigate to `http://localhost:8080`. You should now see the Solar Eclipse Explorer application running.
