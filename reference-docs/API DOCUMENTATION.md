# Endpoints

- **Error Response:**

**Code:** `404 NOT FOUND`
**Content:**
```json
{
	"error" : {
		"status" : 404,
		"message" : "Not Found"
	}
}
```

_OR_

**Code:** `500 INTERNAL ERROR`
**Content:**
```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error"
  }
}
```

## Majors
Returns json data for all the majors

- **URL**
/major

- **Method:**
`GET`

- **URL Params**
_None Required_

- **Success Response:**
**Code:** 200
**Content:**
```json
[
	{
	"idMajor" : 0000,
	"name" : "Major Name"
	},
	{
	"idMajor" : 1234,
	"name" : "Major Name 2"
	}
]
```

## Concentrations
Returns json data for all the concentrations given a major

- **URL**
/concentration

- **Method:**
`GET`

- **URL Params**
_Required:_ Major Id
`majId=[integer]`
`/concentration?majId=[NNN]`

- **Success Response:**
**Code:** 200
**Content:**
```json
[
	{
		"idConcentration" : 0000,
		"name" : "Concentration Name 1"
	},
	{
		"idConcentration" : 1234,
		"name" : "Concentration Name 2"
	}
]
```


## Courses
Returns json data for all courses given a major and concentration. 

- **URL**
1. /courses/major
2. /courses/concentration

- **Method:**
`GET`

- **URL Params**
1. _Required:_ Major Id
`majid=[integer]`
`/courses/major?majid=[NNN]`
2. _Required:_ Concentration Id
`conid=[integer]`
`/courses/concentration?conid=[NNN]`

- **Success Response:**
**Code:** 200
**Content:**
```json
[
	{
		"idCourse" : 0000,
		"name" : "Course Name 1",
		"subject" : 'XY',
		"number" : "123",
		"prerequisites" : "XZ123,AB456",
		"semesters" : "Fa,Wi,Sp"
	},
	{
		"idCourse" : 9604,
		"name" : "Course Name 2",
		"subject" : 'AB',
		"number" : "456",
		"prerequisites" : "XZ123",
		"semesters" : "Fa,Sp"
	}
]
```


# Sample Call
```javascript
// Getting all concentrations for a major (with id 2)
var URLParams = new URLSearchParams();
URLParams.set("majId", 2);
fetch("/concentration?" + URLParams.toString())
.then(result => result.json())
.then((response) => {
	console.log(response);
});
```
