# Solar Eclipse Explorer Flask Application

This project is a Flask web application designed to provide information and interactive features related to viewing the 2024 Solar Eclipse. It is containerized using Docker for easy setup and deployment.

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
