package com.slm.backend.controller;

import com.slm.backend.dto.CreateHeroRequest;
import com.slm.backend.dto.HeroDto;
import com.slm.backend.dto.UpdateHeroRequest;
import com.slm.backend.service.HeroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/heroes")
@RequiredArgsConstructor
public class HeroController {

    private final HeroService heroService;

    /**
     * Get all heroes with optional status filter
     * Public endpoint - defaults to published only
     */
    @GetMapping
    public ResponseEntity<List<HeroDto>> getAllHeroes(
            @RequestParam(required = false, defaultValue = "published") String status
    ) {
        List<HeroDto> heroes = heroService.getAllHeroes(status);
        return ResponseEntity.ok(heroes);
    }

    /**
     * Get hero by ID
     * Public endpoint
     */
    @GetMapping("/{id}")
    public ResponseEntity<HeroDto> getHeroById(@PathVariable Long id) {
        HeroDto hero = heroService.getHeroById(id);
        return ResponseEntity.ok(hero);
    }

    /**
     * Get published count (for UI to show X/5)
     * Public endpoint
     */
    @GetMapping("/count/published")
    public ResponseEntity<Map<String, Long>> getPublishedCount() {
        long count = heroService.getPublishedCount();
        return ResponseEntity.ok(Map.of("count", count, "max", 5L));
    }

    /**
     * Create a new hero
     * Admin only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createHero(
            @Valid @RequestBody CreateHeroRequest request
    ) {
        HeroDto hero = heroService.createHero(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Hero created successfully",
                "hero", hero
        ));
    }

    /**
     * Update a hero
     * Admin only
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateHero(
            @PathVariable Long id,
            @Valid @RequestBody UpdateHeroRequest request
    ) {
        HeroDto hero = heroService.updateHero(id, request);
        return ResponseEntity.ok(Map.of(
                "message", "Hero updated successfully",
                "hero", hero
        ));
    }

    /**
     * Delete a hero
     * Admin only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteHero(@PathVariable Long id) {
        heroService.deleteHero(id);
        return ResponseEntity.ok(Map.of("message", "Hero deleted successfully"));
    }
}
