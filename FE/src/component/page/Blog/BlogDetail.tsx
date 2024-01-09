import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllBlogQuery, useGetOneBlogQuery } from '../../../api/blog';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useGetOneUserQuery } from '../../../api/auth';

const BlogDetail = () => {
    const { id }: any = useParams();
    const { data, isLoading } = useGetOneBlogQuery(id);

    const { data: user } = useGetOneUserQuery(data?.data[0]?.user_id)
    console.log(user);
    const { data: allBlogs } = useGetAllBlogQuery("");

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    const truncateTitle = (title: string, maxLength: number) => {
        return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
    };

    const truncateContent = (content: string, maxLength: number) => {
        return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
    };

    const [selectedBlogId, setSelectedBlogId] = useState('');

    const handleRelatedBlogClick = (blogId: string) => {
        setSelectedBlogId(blogId);
        const relatedBlogUrl = `/blog/${blogId}`;
        window.location.href = relatedBlogUrl;
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Blog not found</div>;
    }

    const blogTitle = data?.data[0].blog_title;
    const blogContent = data?.data[0].blog_content;
    const blogDate = data?.data[0].blog_date;
    const formattedDate = formatDate(blogDate);
    const blogImage = data?.data[0].blog_image;

    // Filter related blogs, excluding the current blog and the selected blog
    const relatedBlogs = allBlogs?.data?.filter((blog: any) => {
        return blog.blog_id !== id && blog.blog_id !== selectedBlogId;
    });

    return (
        <>
            <div style={{ marginLeft: "20%" }}>
                <h2 style={{ marginTop: "200px", fontSize: "24px", color: "red" }}>{blogTitle}</h2>
                <hr style={{ width: "80%" }} />
                <p><CalendarOutlined /> Đăng ngày: {formattedDate}</p>
                <p><UserOutlined /> Người đăng: <span style={{ fontWeight: 'bold' }}>{user?.data?.user_lastname} {user?.data?.user_firstname}</span></p>
                <p style={{ fontWeight: "500" }}>{blogTitle}</p>
                <img
                    src={blogImage}
                    alt=""
                    width={"600px"}
                    height={"400px"}
                />
                <p style={{ width: "70%", marginTop: "50px" }}>{blogContent}</p>
                <hr style={{ width: "80%", marginTop: "50px" }} />
            </div>

            <section className="product_list best_seller">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="section_tittle text-center">
                                <h2>Bài Viết Liên Quan</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center latest_product_inner">
                        {relatedBlogs?.map((relatedBlog: any) => (
                            <div key={relatedBlog?.blog_id} className="col-lg-4" style={{ padding: "20px" }}>
                                <div className="single_product_item">
                                    <Link to="#" onClick={() => handleRelatedBlogClick(relatedBlog?.blog_id)}>
                                        <img src={relatedBlog?.blog_image} alt="" />
                                    </Link>
                                    <Link to="#" onClick={() => handleRelatedBlogClick(relatedBlog?.blog_id)}>
                                        <p style={{ marginTop: "10px" }}>{truncateTitle(relatedBlog?.blog_title, 20)}</p>
                                    </Link>
                                    <p style={{ marginTop: "20px" }}>{truncateContent(relatedBlog?.blog_content, 100)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <img src="https://res.cloudinary.com/dw6wgytc3/image/upload/v1700291370/banner_qsh16t.png" alt="" width={"100%"} />

        </>
    );
};

export default BlogDetail;
