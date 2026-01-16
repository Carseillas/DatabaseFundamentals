import bcrypt from "bcrypt";

bcrypt.hash("admin", 10).then(hash => {
  console.log(hash);
});