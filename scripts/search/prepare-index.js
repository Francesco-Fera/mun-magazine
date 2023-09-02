import path from "path";
import { promises as fs } from "fs";
import { globby } from "globby";
import grayMatter from "gray-matter";

(async function () {
  // prepare the dirs
  const mainDir = path.join(process.cwd(), "../..");
  const srcDir = path.join(mainDir, "/src");
  const publicDir = path.join(mainDir, "/public");
  const contentDir = path.join(srcDir, "pages", "posts");
  const contentFilePattern = path.join(contentDir, "*.md");
  const indexFile = path.join(publicDir, "search-index.json");
  const getSlugFromPathname = (pathname) =>
    path.basename(pathname, path.extname(pathname));
  //const contentFilePaths = await globby(curr);
  console.log("Content" + contentDir);

  const contentFilePaths = await fs.readdir(contentDir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    const mdFiles = files.filter((file) => path.extname(file) === ".md");
    const filePaths = mdFiles.map((path) => path.join(contentDir, file));

    console.log("MD Files:", filePaths);
    return filePaths;
  });
  console.log(contentFilePaths);

  // if (contentFilePaths.length) {
  //   const files = contentFilePaths.map(
  //     async (filePath) => await fs.readFile(filePath, "utf8")
  //   );
  //   const index = [];
  //   let i = 0;
  //   for await (let file of files) {
  //     const {
  //       data: { title, description, tags },
  //       content,
  //     } = grayMatter(file);
  //     index.push({
  //       slug: getSlugFromPathname(contentFilePaths[i]),
  //       category: "blog",
  //       title,
  //       description,
  //       tags,
  //       body: content,
  //     });
  //     i++;
  //   }
  //   await fs.writeFile(indexFile, JSON.stringify(index));
  //   console.log(
  //     `Indexed ${index.length} documents from ${contentDir} to ${indexFile}`
  //   );
  //   console.log("finished");
  // }
})();
