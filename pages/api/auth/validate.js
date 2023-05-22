import jwt from "jsonwebtoken";

export default function ValidateSession(req, res) {
  const { myTokenName } = req.cookies;

  if (!myTokenName) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const token = jwt.verify(myTokenName, "secret");
  return res.status(200).json(token);
};