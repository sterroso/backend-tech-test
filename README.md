# Technical Evaluation Test for a Senior Back-end Developer

## Overview

This test is designed to assess the candidate's proficiency in designing and implementing microservices
architectures using gRPC, Nest.JS, and Golang as an API gateway. The candidate should demonstrate their ability
to develop scalable, efficient, and secure back-end systems.
Requirements

1. Product Service (Nest.JS):
    a. Implement CRUD operations for products (Create, Read, Update, Delete).
    b. Each product should have at least a name, description, and price and available quantity.

2. Order Service (Nest.JS):
    a. Implement functionality to place an order. An order should reference one or more products and
    specify the quantities.
    b. Implement a simple order listing functionality, which returns a list of all orders with product
    details.
    c. Implement an interservice call to Product service using gRPC to ensure that the product actually
    exists and has quantity available.

3. API Gateway (Golang):
    a. Develop an API Gateway that exposes REST endpoints for the functionalities of the Product and
    Order Services.
    b. Implement JWT authentication to secure the endpoints.
    c. Add a rate limiting feature to protect the services from overuse (Bonus).

4. gRPC:
    a. Define gRPC protocols in a separate project.
    b. Make sure to compile these and include them in respective projects as compiled gRPC protocols.

5. gRPC Communication:
    a. Establish gRPC communication between the microservices and the API Gateway.
    b. Define the necessary Protobuf messages and services for the operations above.

6. Unit Tests:
    a. Write unit tests for the business logic of your application, including the data fetching and parsing
    logic.

7. Bonus - Unit Tests (Optional):
    a. Write unit tests for Product and Order microservices to test business logic.
    Deployment and Documentation

1. Docker:
    a. Containerize the Product Service, Order Service, and API Gateway.
    b. Provide a Docker Compose file to orchestrate the startup of the entire system.

2. Documentation:
    a. Document the system architecture and explain the role of each component.
    b. Provide a Postman collection or Swagger documentation for the REST API exposed by the API
    Gateway.
    c. Include setup and run instructions for the test environment.

## Evaluation Criteria

- Architecture Design: Efficiency and clarity of the microservices architecture.
- Code Quality: Adherence to best practices, code readability, and proper error handling.
- Functionality: Correct implementation of the specified features and requirements.
- Security Measures: Implementation of security best practices, especially in authentication,
authorization, and communication.
- Documentation and Deployment: Completeness and clarity of documentation, ease of deployment and
setup.

## Submission Guidelines

- Provide source codes via a GitHub repository.
- Include a README file with instructions on how to build and run the application, as well as any other
relevant documentation.

## Deadline

Candidates have 3 days from the date of receipt of this test to submit their completed evaluation for review.
