package com.slm.backend.service;

import com.slm.backend.dto.CreateHeroRequest;
import com.slm.backend.dto.HeroDto;
import com.slm.backend.dto.UpdateHeroRequest;
import com.slm.backend.entity.Hero;
import com.slm.backend.repository.HeroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HeroService {

    private static final int MAX_PUBLISHED_HEROES = 5;
    private final HeroRepository heroRepository;

    @Transactional(readOnly = true)
    public List<HeroDto> getAllHeroes(String status) {
        List<Hero> heroes;

        if (status != null && !status.isEmpty() && !status.equals("all")) {
            Hero.Status heroStatus = Hero.Status.valueOf(status.toUpperCase());
            heroes = heroRepository.findByStatus(
                heroStatus,
                Sort.by(Sort.Direction.ASC, "displayOrder")
            );
        } else {
            heroes = heroRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
        }

        return heroes.stream()
                .map(HeroDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HeroDto getHeroById(Long id) {
        Hero hero = heroRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hero not found with id: " + id));
        return HeroDto.fromEntity(hero);
    }

    @Transactional(readOnly = true)
    public long getPublishedCount() {
        return heroRepository.countByStatus(Hero.Status.PUBLISHED);
    }

    @Transactional
    public HeroDto createHero(CreateHeroRequest request) {
        // Validate max published if trying to publish immediately
        if ("published".equalsIgnoreCase(request.getStatus())) {
            validateMaxPublished();
        }

        Hero hero = Hero.builder()
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .badge(request.getBadge())
                .socialProof(request.getSocialProof())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .primaryCtaLabel(request.getPrimaryCtaLabel())
                .primaryCtaHref(request.getPrimaryCtaHref())
                .secondaryCtaLabel(request.getSecondaryCtaLabel())
                .secondaryCtaHref(request.getSecondaryCtaHref())
                .status(parseStatus(request.getStatus()))
                .build();

        Hero saved = heroRepository.save(hero);
        return HeroDto.fromEntity(saved);
    }

    @Transactional
    public HeroDto updateHero(Long id, UpdateHeroRequest request) {
        Hero hero = heroRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hero not found with id: " + id));

        // Validate max published if changing to published
        if (request.getStatus() != null && "published".equalsIgnoreCase(request.getStatus())
                && hero.getStatus() != Hero.Status.PUBLISHED) {
            validateMaxPublished();
        }

        if (request.getTitle() != null) {
            hero.setTitle(request.getTitle());
        }
        if (request.getSubtitle() != null) {
            hero.setSubtitle(request.getSubtitle());
        }
        if (request.getBadge() != null) {
            hero.setBadge(request.getBadge());
        }
        if (request.getSocialProof() != null) {
            hero.setSocialProof(request.getSocialProof());
        }
        if (request.getDisplayOrder() != null) {
            hero.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getPrimaryCtaLabel() != null) {
            hero.setPrimaryCtaLabel(request.getPrimaryCtaLabel());
        }
        if (request.getPrimaryCtaHref() != null) {
            hero.setPrimaryCtaHref(request.getPrimaryCtaHref());
        }
        if (request.getSecondaryCtaLabel() != null) {
            hero.setSecondaryCtaLabel(request.getSecondaryCtaLabel());
        }
        if (request.getSecondaryCtaHref() != null) {
            hero.setSecondaryCtaHref(request.getSecondaryCtaHref());
        }
        if (request.getStatus() != null) {
            hero.setStatus(parseStatus(request.getStatus()));
        }

        Hero saved = heroRepository.save(hero);
        return HeroDto.fromEntity(saved);
    }

    @Transactional
    public void deleteHero(Long id) {
        if (!heroRepository.existsById(id)) {
            throw new IllegalArgumentException("Hero not found with id: " + id);
        }
        heroRepository.deleteById(id);
    }

    private void validateMaxPublished() {
        long publishedCount = heroRepository.countByStatus(Hero.Status.PUBLISHED);
        if (publishedCount >= MAX_PUBLISHED_HEROES) {
            throw new IllegalArgumentException(
                "Maximum " + MAX_PUBLISHED_HEROES + " published hero items allowed. " +
                "Please archive an existing hero before publishing a new one.");
        }
    }

    private Hero.Status parseStatus(String status) {
        if (status == null || status.isEmpty()) {
            return Hero.Status.DRAFT;
        }
        try {
            return Hero.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Hero.Status.DRAFT;
        }
    }
}
