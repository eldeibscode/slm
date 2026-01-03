# CORS Configuration Guide

## Overview

The CORS (Cross-Origin Resource Sharing) configuration has been updated to be flexible, environment-aware, and support same-origin requests. The configuration now uses `allowedOriginPatterns` instead of `allowedOrigins`, which provides better flexibility including wildcard support.

## Key Features

### 1. **Environment-Based Configuration**
CORS origins are now configurable via environment variables, making it easy to adjust for different deployment environments without code changes.

### 2. **Wildcard Support**
Using `allowedOriginPatterns` allows:
- Wildcard subdomains: `https://*.biedle.com`
- Wildcard ports (development): `http://localhost:*`
- Dynamic origin matching

### 3. **Same-Origin Requests**
The configuration automatically allows requests from the same origin as the backend server, which is especially useful when the frontend is served from the same domain.

## Configuration Files

### Application Properties

**Development (`application-dev.properties`):**
```properties
cors.allowed-origins=http://localhost:*,http://localhost:4200,http://localhost:3000,http://localhost:5173
```

**Production (`application-prod.properties`):**
```properties
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:https://biedle.com,http://biedle.com,https://*.biedle.com}
```

**Default (`application.properties`):**
```properties
cors.allowed-origins=http://localhost:4200,http://localhost:3000,http://localhost:5173
```

### Docker Configuration

**docker-compose.yml:**
```yaml
environment:
  CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS:-https://biedle.com,http://biedle.com,https://*.biedle.com}
```

**.env.example:**
```env
CORS_ALLOWED_ORIGINS=https://biedle.com,http://biedle.com,https://*.biedle.com
```

## How to Configure

### For Local Development

No changes needed! The default configuration allows all common localhost ports.

### For Docker/Container Deployment

1. Edit your `.env` file:
```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://*.yourdomain.com
```

2. Rebuild and restart:
```bash
docker-compose up -d --build
```

### For Traditional Deployment

Update `application-prod.properties` or set environment variable:
```bash
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

## Examples

### Single Domain
```properties
cors.allowed-origins=https://yourdomain.com
```

### Multiple Specific Domains
```properties
cors.allowed-origins=https://yourdomain.com,https://app.yourdomain.com,https://admin.yourdomain.com
```

### Wildcard Subdomain
```properties
cors.allowed-origins=https://*.yourdomain.com,https://yourdomain.com
```

### Development with Any Port
```properties
cors.allowed-origins=http://localhost:*
```

### Mixed Configuration
```properties
cors.allowed-origins=https://yourdomain.com,https://*.yourdomain.com,http://localhost:*
```

## Implementation Details

### WebConfig.java
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:4200,http://localhost:3000,http://localhost:5173}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = allowedOrigins.split(",");

        registry.addMapping("/**")
                .allowedOriginPatterns(origins) // Supports wildcards
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### SecurityConfig.java
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    List<String> origins = Arrays.asList(allowedOrigins.split(","));

    configuration.setAllowedOriginPatterns(origins); // Supports wildcards
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(List.of("Authorization"));
    configuration.setMaxAge(3600L);

    // ... rest of configuration
}
```

## Benefits

### 1. **Flexibility**
- Easy to update without code changes
- Environment-specific configurations
- Supports complex patterns

### 2. **Security**
- Explicit control over allowed origins
- No blanket `*` wildcard (maintains credential support)
- Environment variable based secrets

### 3. **Developer Experience**
- Works out of the box for local development
- Clear documentation
- Easy to debug

### 4. **Production Ready**
- Configurable via environment variables
- Supports multiple domains/subdomains
- Compatible with Docker/Kubernetes

## Troubleshooting

### CORS Error: "Origin not allowed"

**Check current configuration:**
```bash
# In Docker container
docker-compose exec backend env | grep CORS

# In application logs
# Look for CORS-related debug messages
```

**Verify allowed origins:**
1. Check `.env` file has correct `CORS_ALLOWED_ORIGINS`
2. Restart the application
3. Test with curl:
```bash
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://your-backend:3000/api/some-endpoint -v
```

### Wildcard Not Working

Make sure you're using `allowedOriginPatterns` (not `allowedOrigins`). The code has been updated to use patterns.

### Different Origin Per Environment

Use environment-specific property files or environment variables:
```bash
# Development
export CORS_ALLOWED_ORIGINS=http://localhost:*

# Staging
export CORS_ALLOWED_ORIGINS=https://*.staging.yourdomain.com

# Production
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://*.yourdomain.com
```

## Migration Notes

### Changes from Previous Version

- **Before**: Hardcoded origins in `WebConfig.java` and `SecurityConfig.java`
- **After**: Environment-based configuration with wildcard support

### Breaking Changes

None! The default configuration maintains backward compatibility with localhost development.

## Security Best Practices

1. **Never use `*` wildcard in production** - Always specify explicit domains or patterns
2. **Use HTTPS in production** - Include `https://` origins for production
3. **Limit wildcards** - Use specific subdomains when possible
4. **Review regularly** - Audit allowed origins periodically
5. **Environment segregation** - Different origins for dev/staging/prod

## Additional Resources

- [Spring CORS Documentation](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP CORS Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
