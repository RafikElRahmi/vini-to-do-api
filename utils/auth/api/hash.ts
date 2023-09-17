import  bcrypt from "bcryptjs";
async function hash(password:string) {
  const saltRounds : number = 10;
  const passwordHash: string = await bcrypt.hash(password, saltRounds);
  return passwordHash;
}

export default hash;
