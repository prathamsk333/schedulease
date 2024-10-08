API must use JSON format for both recieve and send and bearer token authentication and should be RESTful.

## API Endpoints

### POST /auth/signup

```json
{
  "username": string,
  "email": string,
  "password": string,
  "phone": string
}
```

Response:

```json
{
  "status": "success"
}
```

### POST /auth/verify

```json
{
  "email": string,
  "code": string
}
```

Response:

```json
{
  "status": "success"
  "token": string
}
```

If the user is already verified, the response will be:

```json
{
  "status": "fail",
  "message": "User already verified"
}
```

### POST /auth/login

```json
{
  "email": string,
  "password": string
}
```

Response:

```json
{
  "status": "success",
  "token": string
}
```

### POST /data/listAppointments

```json
{
  "token": string,
  "filter": "all" | "today" | "week" | "month"
}
```
            
Response:

```json
{
  "status": "success",
  "appointments": [
    {
      "id": string,
      "date": string,
      "startTime": Date,
      "title": string,
      "desc": string,
      "category": "education" | "health" | "work" | "personal"
    }
  ]
}
```

### POST /data/appointmentDetails

```json
{
  "token": string,
  "id": string
}

```json
{
    "status": "success",
    "appointment": {
        "id": string,
        "date": string,
        "startTime": Date,
        "endTime": Date,
        "desc": string,
        "title": string,
        "category": "education" | "health" | "work" | "personal",
        "mode": "online" | "offline",
        "location" : string?,
        "participants": [
            {
                "name": string,
                "email": string,
                "phone": string
            }
        ],
    }
}
```

### POST /data/addAppointment

```json
{
  "token": string,
  "date": string,
  "startTime": Date,
  "endTime": Date,
  "title": string,
  "desc": string,
  "category": "education" | "health" | "work" | "personal",
  "mode": "online" | "offline",
  "location" : string?,
  "participants": [
    {
      "name": string,
      "email": string,
      "phone": string,
      "userID": string
    }
  ]
}
```

Response:

```json

{

  "status": "success",
  "appointmentID": string
}

```

### POST /data/deleteAppointment

```json

{
  "token": string,
  "reason" : string
}

```
