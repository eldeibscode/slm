package com.slm.backend.repository;

import com.slm.backend.entity.Hero;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroRepository extends JpaRepository<Hero, Long> {

    List<Hero> findByStatus(Hero.Status status, Sort sort);

    List<Hero> findAllByOrderByDisplayOrderAsc();

    List<Hero> findByStatusOrderByDisplayOrderAsc(Hero.Status status);

    long countByStatus(Hero.Status status);
}
