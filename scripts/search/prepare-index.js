import path from "path";
import { promises as fs } from "fs";
import grayMatter from "gray-matter";

const mainDir = path.join(process.cwd(), "../..");
const srcDir = path.join(mainDir, "/src");
const publicDir = path.join(mainDir, "/public");
const contentDir = path.join(srcDir, "pages", "posts");
const indexFile = path.join(publicDir, "search-index.json");
const getSlugFromPathname = (pathname) =>
  path.basename(pathname, path.extname(pathname));
let contentFilePaths;

async function findMDFiles(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);

    const fileExtension = ".md";
    const mdFiles = files.filter(
      (file) => path.extname(file) === fileExtension
    );

    const filePaths = mdFiles.map((file) => path.join(directoryPath, file));

    return filePaths;
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err;
  }
}

async function processMDFiles(contentFilePaths, indexFile, contentDir) {
  if (contentFilePaths.length) {
    const files = contentFilePaths.map(async (filePath) => {
      try {
        const fileContent = await fs.readFile(filePath, "utf8");
        return { filePath, fileContent };
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
      }
    });

    const index = [];
    for (const filePromise of files) {
      const fileData = await filePromise;
      if (fileData) {
        const {
          data: { title, description, tags },
          content,
        } = grayMatter(fileData.fileContent);
        index.push({
          slug: getSlugFromPathname(fileData.filePath),
          category: "blog",
          title,
          description,
          tags,
          body: content,
        });
      }
    }

    try {
      await fs.writeFile(indexFile, JSON.stringify(index));
      console.log(
        `Indexed ${index.length} documents from ${contentDir} to ${indexFile}`
      );
      console.log("Finished");
    } catch (error) {
      console.error("Error writing index file:", error);
    }
  }
}

(async function () {
  findMDFiles(contentDir)
    .then((filePaths) => {
      contentFilePaths = filePaths;
      processMDFiles(contentFilePaths, indexFile, contentDir);
      console.log("contentFilePaths ", filePaths);
      console.log("contentFilePaths LENGTH", contentFilePaths.length);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
})();
