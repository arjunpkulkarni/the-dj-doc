const express = require('express');
const app = express();
const cors = require('cors'); // Import the cors middleware
const port = process.env.PORT || 3001; // Choose a port number

// Define a route to serve your React app
app.use(express.static('build')); // Assuming your React app's build folder is 'build'

app.use(cors({ origin: '*' }));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
