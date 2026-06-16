# StepWise API Contract

Base URL: `http://localhost:5000/api/v1`

---

## Endpoints

### 1. Explain a DSA Problem
Sends a problem to Claude and returns a step-by-step explanation.

**POST** `/api/v1/explain`

**Request Body:**
```json
{
  "problem": "Given an array of integers, return indices of the two numbers that add up to a target."
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "problem": "Given an array of integers...",
    "explanation": "...",
    "approach": "...",
    "complexity": {
      "time": "O(n)",
      "space": "O(n)"
    }
  }
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | Missing or empty problem in request body |
| `500` | Claude API failed or server error |

---

### 2. Get All Past Explanations
Returns all previously explained problems from MongoDB.

**GET** `/api/v1/explanations`

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc...",
      "problem": "Two Sum",
      "explanation": "...",
      "approach": "...",
      "complexity": {
        "time": "O(n)",
        "space": "O(n)"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `500` | Database fetch failed |

---

### 3. Get Single Explanation by ID
Returns one explanation by its MongoDB ID.

**GET** `/api/v1/explanations/:id`

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "problem": "Two Sum",
    "explanation": "...",
    "approach": "...",
    "complexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `404` | No explanation found with that ID |
| `500` | Database fetch failed |

---

## Response Format Rule

Every response follows the same shape:

**Success:**
```json
{ "success": true, "data": {} }
```

**Error:**
```json
{ "success": false, "message": "description of what went wrong" }
```