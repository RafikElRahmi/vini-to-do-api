import jwt from "jsonwebtoken";

export function decodeAccessToken(token) {
  let decodedToken: any;
  const secretKey = `${process.env.SECRET_KEY}`;
  try {
    decodedToken = jwt.verify(token, secretKey);
  } catch (error) {
    console.log(error);
  }
  return decodedToken;
}

export function decodeRefreshToken(token) {
  let decodedToken: any;
  const secretKey = `${process.env.SECRET_KEY_REFRESH}`;
  try {
    decodedToken = jwt.verify(token, secretKey);
  } catch (error) {
    return decodedToken;
  }
  return decodedToken;
}
