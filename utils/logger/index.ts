import fs from "fs/promises";

const logError = (trace:any ) => {
  try {
    if (trace) {
      const traceString: string | Uint8Array = `${trace}\n ...................................................................................... \n`
      fs.appendFile("./logs/errors.log", traceString);
    }
  } catch (error) {
    console.log(error);
  }
};
export default logError;
