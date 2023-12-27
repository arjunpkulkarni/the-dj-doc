package com.example.harmonix.service;

import com.example.harmonix.models.User;
import com.example.harmonix.repository.UserRepository;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.example.harmonix.exceptions.NotFoundException;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Map<String, List<User>> nameIndex;
    private final Map<String, List<String>> adjacencyList;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.nameIndex = buildNameIndex();
        this.adjacencyList = buildUserGraph();
    }

    private Map<String, List<String>> buildUserGraph() {
        List<User> allUsers = userRepository.findAll();
        Map<String, List<String>> graph = new HashMap<>();

        for (User user : allUsers) {
            String currentUserName = user.getUsername();
            if (!graph.containsKey(currentUserName)) {
                graph.put(currentUserName, new ArrayList<>());
            }

            List<User> following = user.getFollowing();
            if (following != null) {
                for (User otherFriend : following) {
                    String otherFriendName = otherFriend.getUsername();
                    if (!otherFriendName.isBlank() && !otherFriendName.equals(currentUserName)) {
                        graph.get(currentUserName).add(otherFriendName);
                    }
                }
            }
        }

        return graph;
    }

    public List<String> getFriends(String user) {
        return adjacencyList.getOrDefault(user, new ArrayList<>());
    }

    public List<String> getFriendRecommendations(String user) {
        Set<String> friendsOfFriends = new HashSet<>();
        List<String> userFriends = getFriends(user);

        for (String friend : userFriends) {
            List<String> friends = getFriends(friend);
            friendsOfFriends.addAll(friends);
        }

        friendsOfFriends.removeAll(userFriends);
        friendsOfFriends.remove(user);

        return new ArrayList<>(friendsOfFriends);
    }

    // Create or Update (Save) a user
    public User saveOrUpdateUser(User user) {
        return userRepository.save(user);
    }

    // Read (Find) a user by ID
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // Read (Find) all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User updatedUser) throws NotFoundException {
        // Check if the user exists in the database
        Optional<User> existingUserOptional = userRepository.findById(updatedUser.getId());

        if (existingUserOptional.isPresent()) {
            // If the user exists, save the updated user
            return userRepository.save(updatedUser);
        } else {
            throw new NotFoundException("Exception message");
        }
    }

    public void deleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }

    private Map<String, List<User>> buildNameIndex() {
        List<User> allUser = userRepository.findAll();
        Map<String, List<User>> index = new HashMap<>();

        for (User user : allUser) {
            String name = user.getUsername().toLowerCase();
            index.computeIfAbsent(name, k -> new ArrayList<>()).add(user);
        }

        return index;
    }

    public List<User> findFriends(String query) {
        String queryLowerCase = query.toLowerCase();
        return nameIndex.entrySet().stream()
                .filter(entry -> entry.getKey().contains(queryLowerCase))
                .flatMap(entry -> entry.getValue().stream())
                .collect(Collectors.toList());
    }

}
