# Intersections API

The Intersections API is a RESTful API that allows you to find intersections between a given linestring and randomly generated lines. It is built using Node.js, Express, and the Turf.js library for geospatial calculations.

## API Endpoints

### GET /api/intersections

This endpoint is used for testing purposes. It returns a simple greeting message to confirm that the API is up and running.

### POST /api/intersections

This endpoint is used to find intersections between a linestring and randomly generated lines.

**Request:**
- Method: POST
- URL: http://localhost:3000/api/intersections
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {authToken}
- Body:
  ```json
  {
    "linestring": {
      "type": "LineString",
      "coordinates": [
        [longitude1, latitude1],
        [longitude2, latitude2],
        ...
      ]
    }
  }



Response:

If intersections are found:
Status: 200 OK
Body: JSON array containing intersecting line IDs and points of intersection. For example:

[
  {
    "lineId": "L1",
    "point": [longitude, latitude]
  },
  {
    "lineId": "L2",
    "point": [longitude, latitude]
  },
  ...
]



If no intersections are found:
Status: 200 OK
Body: Empty JSON array []
If the linestring is missing or malformed:
Status: 400 Bad Request
Body: JSON object with an error message, for example:


{
  "error": "Missing linestring in the request body"
}


If the authentication token is missing or invalid:
Status: 401 Unauthorized
Body: JSON object with an error message, for example:

{
  "error": "Unauthorized"
}


If there is an internal server error:
Status: 500 Internal Server Error
Body: JSON object with an error message, for example:

{
  "error": "Internal Server Error"
}


Testing the API
You can test the API using tools like Postman or cURL.

Start the server by running node server.js.
Make sure to set the appropriate values in the request headers, such as Content-Type and Authorization.
Use the POST /api/intersections endpoint to send a linestring in the request body and receive the intersections as a response.

