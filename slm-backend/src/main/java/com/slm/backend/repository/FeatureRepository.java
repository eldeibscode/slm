package com.slm.backend.repository;

import com.slm.backend.entity.Feature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {

    Page<Feature> findByStatus(Feature.Status status, Pageable pageable);

    @Query("SELECT f FROM Feature f WHERE f.status = :status " +
           "ORDER BY CASE WHEN f.displayOrder IS NULL THEN 1 ELSE 0 END, " +
           "f.displayOrder ASC, f.createdAt DESC")
    List<Feature> findPublishedOrdered(@Param("status") Feature.Status status);

    @Query("SELECT f FROM Feature f " +
           "ORDER BY CASE WHEN f.displayOrder IS NULL THEN 1 ELSE 0 END, " +
           "f.displayOrder ASC, f.createdAt DESC")
    List<Feature> findAllOrdered();

    @Query("SELECT COUNT(f) FROM Feature f WHERE f.status = :status")
    long countByStatus(@Param("status") Feature.Status status);
}
