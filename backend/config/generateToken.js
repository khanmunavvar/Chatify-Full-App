
// Import the library used to create and verify JSON Web Tokens
import jwt from "jsonwebtoken"; 
// Define a function that accepts the user's unique ID as an argument
const generateToken = (id) => {
  // The jwt.sign method creates a new token
  return jwt.sign(
    { id }, // Payload: This embeds the user's ID inside the token so we can identify them later
    process.env.JWT_SECRET, // Secret Key: The private password stored in your .env file used to digitally sign the token
    {
      expiresIn: "30d", // Option: Sets the token to strictly expire after 30 days for security
    }
  );
};

export default generateToken; 