export const EXAMPLES = {
  "OpenAPI Endpoint": `{
  "openapi": "3.0.0",
  "paths": {
    "/users/{id}": {
      "get": {
        "summary": "Get a user by ID",
        "description": "Returns a single user object. Requires authentication via Bearer token in the Authorization header.",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string", "format": "uuid" },
            "description": "The unique identifier of the user"
          },
          {
            "name": "include",
            "in": "query",
            "required": false,
            "schema": { "type": "string", "enum": ["profile", "settings", "teams"] },
            "description": "Related resources to include in the response"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string", "format": "uuid" },
                    "email": { "type": "string", "format": "email" },
                    "name": { "type": "string" },
                    "role": { "type": "string", "enum": ["admin", "member", "viewer"] },
                    "created_at": { "type": "string", "format": "date-time" }
                  }
                }
              }
            }
          },
          "404": {
            "description": "User not found"
          }
        }
      }
    }
  }
}`,

  "Config Object": `{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_production",
    "ssl": true,
    "pool": {
      "min": 2,
      "max": 10,
      "idle_timeout": 30000,
      "acquire_timeout": 60000
    },
    "replicas": [
      { "host": "replica-1.db.internal", "port": 5432, "weight": 50 },
      { "host": "replica-2.db.internal", "port": 5432, "weight": 50 }
    ]
  },
  "cache": {
    "driver": "redis",
    "host": "cache.internal",
    "port": 6379,
    "ttl": 3600,
    "prefix": "myapp:"
  },
  "auth": {
    "provider": "oauth2",
    "client_id": "app-client-id",
    "scopes": ["read", "write", "admin"],
    "token_expiry": 86400,
    "refresh_enabled": true
  }
}`,

  "Error Codes": `{
  "errors": {
    "AUTH_001": {
      "code": "AUTH_001",
      "message": "Invalid authentication token",
      "http_status": 401,
      "description": "The provided token is expired, malformed, or has been revoked. Generate a new token via the /auth/token endpoint.",
      "resolution": "Re-authenticate using your credentials or refresh token"
    },
    "AUTH_002": {
      "code": "AUTH_002",
      "message": "Insufficient permissions",
      "http_status": 403,
      "description": "Your token is valid but lacks the required scope for this operation.",
      "resolution": "Request additional scopes from your organization admin"
    },
    "RATE_001": {
      "code": "RATE_001",
      "message": "Rate limit exceeded",
      "http_status": 429,
      "description": "You have exceeded the maximum number of requests allowed in the current time window.",
      "resolution": "Wait for the Retry-After header duration, then retry. Consider implementing exponential backoff."
    },
    "DATA_001": {
      "code": "DATA_001",
      "message": "Validation error",
      "http_status": 422,
      "description": "One or more fields in the request body failed validation.",
      "resolution": "Check the 'details' array in the response for specific field errors"
    }
  }
}`,
};

export type ExampleKey = keyof typeof EXAMPLES;
