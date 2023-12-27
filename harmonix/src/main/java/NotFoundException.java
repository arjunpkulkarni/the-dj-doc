package com.example.harmonix.exceptions;

public class NotFoundException extends Exception {

    public NotFoundException() {
        super("Remix not found!");
    }

    public NotFoundException(String message) {
        super(message);
    }

}
