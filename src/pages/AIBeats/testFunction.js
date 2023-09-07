const { App, Credentials } = require("realm-web");

async function testFunction() {
  const app = new App({ id: "mixmeister-onfrh" }); // Replace with your Realm app ID
  const credentials = Credentials.anonymous();
  const user = await app.logIn(credentials);

  try {
    const result = await user.functions.getTheSong(13, 2020, "Rap");
    console.log("Result:", JSON.stringify(result));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Always close the user session when done
    await user.logOut();
  }
}

testFunction();
