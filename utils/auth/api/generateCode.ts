function generateCode() {
  const code = Math.floor(Math.random() * (9 * 10 ** 7 - 1)) + 10 ** 7;
  return code.toString();
}

export default generateCode;
