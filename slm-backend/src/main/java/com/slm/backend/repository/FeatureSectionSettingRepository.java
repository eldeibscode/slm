package com.slm.backend.repository;

import com.slm.backend.entity.FeatureSectionSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureSectionSettingRepository extends JpaRepository<FeatureSectionSetting, Long> {

    // Get the first (and should be only) setting record
    Optional<FeatureSectionSetting> findFirstByOrderByIdAsc();
}
