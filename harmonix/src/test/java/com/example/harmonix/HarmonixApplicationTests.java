package com.example.harmonix;

import com.example.harmonix.models.User;
import com.example.harmonix.models.Remix;
import com.example.harmonix.repositories.UserRepository;
import com.example.harmonix.repositories.RemixRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class HarmonixApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RemixRepository remixRepository;

	@Test
	void testUserRemixAssociation() {
		User user = new User("testUser", "test@example.com", "password");
		Remix remix = new Remix("Test Remix", "Test Artist");

		user.addRemix(remix);
		userRepository.save(user);

		User savedUser = userRepository.findById(user.getId()).orElse(null);
		assertNotNull(savedUser);
		assertEquals(1, savedUser.getRemixes().size());
		assertEquals("Test Remix", savedUser.getRemixes().get(0).getTitle());
	}

	@Test
	void testUserFriendAssociation() {
		User user1 = new User("user1", "user1@example.com", "password");
		User user2 = new User("user2", "user2@example.com", "password");

		user1.addFriend(user2);
		userRepository.save(user1);

		User savedUser1 = userRepository.findById(user1.getId()).orElse(null);
		assertNotNull(savedUser1);
		assertEquals(1, savedUser1.getFriends().size());
		assertEquals("user2", savedUser1.getFriends().get(0).getUsername());
	}

	// Add more tests for other functionalities

}
