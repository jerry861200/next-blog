import Head from 'next/head';

import Layout from "../../components/layout";
import { getAllPostIds, getPostData  } from "../../lib/posts";

export default function Post({ postData}) {
	const {title, id, date} = postData;
  return <Layout>
		<Head>
			<title>{postData.title}</title>
		</Head>
		{title}
		<br />
		{id}
		<br />
		{date}
		<br />
		<div dangerouslySetInnerHTML={{ __html: postData.contentHtml}}></div>
	</Layout>;
}

export async function getStaticProps({ params }){
	const postData = await getPostData(params.id);
	return {
		props:{
			postData,
		},
	}
}

export async function getStaticPaths(){
  const paths = getAllPostIds();
	return {
		paths,
		fallback: false,
	}
};
