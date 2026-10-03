import jwt from "jsonwebtoken";
 
// بتولّد توكن يحتوي على id المستخدم، وينتهي بعد 30 يوم
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
 
export default generateToken;
 