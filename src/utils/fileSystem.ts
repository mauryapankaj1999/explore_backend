import fs from "fs";

export const storeFileAndReturnNameBase64 = async (base64: string) => {
  const tempBase64 = base64.split(",");
  const extension = tempBase64[0].split("/")[1];
  const filename = new Date().getTime() + `.${extension.split(";")[0]}`;
  return new Promise((resolve, reject) => {
    fs.writeFile(`./public/uploads/${filename}`, tempBase64[1], "base64", (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log();
      resolve(filename);
    });
  });
};

export const storeCsvAndReturnName = async (csvData: string, filename_prefix: string = "") => {
  try {
    const filename = `${filename_prefix}${new Date().getTime()}.csv`;

    const fileStream = fs.createWriteStream(`./public/uploads/${filename}`);

    await new Promise((resolve, reject) => {
      const writeStream = fileStream.write(csvData, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });

      if (!writeStream) {
        fileStream.once("drain", resolve); // Resolve after stream drains
      }
    });

    return filename;
  } catch (error) {
    console.error("Error storing CSV:", error);
    throw error; // Re-throw the error for proper handling
  }
};
