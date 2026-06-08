export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    author: {
        id: string;
        name: string;
        image: string;
        role: string;
    };
    comments: Comment[];
    likesCount: number;
}
export interface Tag {
    id: string;
    name: string;
}
export interface Comment {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}
