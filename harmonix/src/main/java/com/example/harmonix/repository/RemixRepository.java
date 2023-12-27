package com.example.harmonix.repository;

import com.example.harmonix.models.Remix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RemixRepository extends JpaRepository<Remix, Long> {
    // Add custom methods if needed
}
