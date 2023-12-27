package com.example.harmonix.service;

import com.example.harmonix.exceptions.NotFoundException;
import com.example.harmonix.models.Remix;
import com.example.harmonix.repository.RemixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class RemixService {

    private final RemixRepository remixRepository;

    @Autowired
    public RemixService(RemixRepository remixRepository) {
        this.remixRepository = remixRepository;
    }

    public Remix getRemixById(Long remixId) throws NotFoundException {
        Optional<Remix> optionalRemix = remixRepository.findById(remixId);

        if (optionalRemix.isPresent()) {
            return optionalRemix.get();
        } else {
            throw new NotFoundException("Remix not found for ID: " + remixId);
        }
    }
}
