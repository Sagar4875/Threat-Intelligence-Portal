package com.example.threatintelligenceportalspring.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // ===========================
    // Secret Key (Minimum 32 Characters)
    // ===========================

    private static final String SECRET_KEY =
            "ThreatIntelligencePortalSecretKey2026SecureJWT";

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // ===========================
    // Token Validity (24 Hours)
    // ===========================

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    // ===========================
    // Generate Token
    // ===========================

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

    }

    // ===========================
    // Extract Email
    // ===========================

    public String extractEmail(String token) {

        return extractClaims(token).getSubject();

    }

    // ===========================
    // Validate Token
    // ===========================

    public boolean validateToken(String token, String email) {

        return extractEmail(token).equals(email)
                && !isTokenExpired(token);

    }

    // ===========================
    // Token Expired?
    // ===========================

    private boolean isTokenExpired(String token) {

        return extractClaims(token)
                .getExpiration()
                .before(new Date());

    }

    // ===========================
    // Extract Claims
    // ===========================

    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

}