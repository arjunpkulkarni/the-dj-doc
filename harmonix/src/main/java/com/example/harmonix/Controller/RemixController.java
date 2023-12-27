package com.example.harmonix.controller;

import com.example.harmonix.exceptions.NotFoundException;
import com.example.harmonix.models.Remix;
import com.example.harmonix.service.RemixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/remixes")
public class RemixController {

    private final RemixService remixService;

    @Autowired
    public RemixController(RemixService remixService) {
        this.remixService = remixService;
    }

    // Get a remix by ID
    @GetMapping("/{remixId}")
    public ResponseEntity<Remix> getRemixById(@PathVariable Long remixId) {
        try {
            Remix remix = remixService.getRemixById(remixId);
            return new ResponseEntity<>(remix, HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Other endpoints for CRUD operations on Remix entity can be added here
}
