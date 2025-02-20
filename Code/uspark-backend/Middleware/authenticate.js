const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  console.log("called");
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
