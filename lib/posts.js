import fs, { readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import {remark} from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), "posts");
export const getSortedPostsData = () => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);
		console.log(fileNames)

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort(({ date: a }, { data: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
};

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id){
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fullContents = readFileSync(fullPath,'utf8');

	const matterResult = matter(fullContents);

	const processedContent = await remark().use(html).process(matterResult.content);
	const contentHtml = processedContent.toString();

	return {
		id,
		contentHtml,
		...matterResult.data,
	}
}