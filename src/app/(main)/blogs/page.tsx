import BlogsClient from './BlogsClient';

export const metadata = {
  title: 'Eko Blog',
  description: 'Čitajte najnovije vesti, priče i savete o ekologiji i volonterizmu na našem blogu.',
};

const BlogsPage = () => {
  return <BlogsClient />;
};

export default BlogsPage;
