import { DBconnection } from "@/lib/db";
import { serializeBlogPost } from "@/lib/blog-shared";
import BlogPost from "@/models/blog";

type BlogQueryOptions = {
    search?: string;
    limit?: number;
    publishedOnly?: boolean;
    excludeSlug?: string;
};

export async function getBlogPosts({
    search = "",
    limit,
    publishedOnly = false,
    excludeSlug,
}: BlogQueryOptions = {}) {
    await DBconnection();

    const trimmedSearch = search.trim();
    const filter: {
        isPublished?: boolean;
        slug?: { $ne: string };
        $text?: { $search: string };
    } = {};

    if (publishedOnly) {
        filter.isPublished = true;
    }

    if (excludeSlug) {
        filter.slug = { $ne: excludeSlug };
    }

    if (trimmedSearch) {
        filter.$text = { $search: trimmedSearch };
    }

    let query = BlogPost.find(filter).sort(
        trimmedSearch ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 }
    );

    if (trimmedSearch) {
        query = query.select({
            title: 1,
            slug: 1,
            category: 1,
            date: 1,
            imageUrl: 1,
            excerpt: 1,
            content: 1,
            isPublished: 1,
            createdAt: 1,
            updatedAt: 1,
            score: { $meta: "textScore" },
        });
    }

    if (limit && limit > 0) {
        query = query.limit(limit);
    }

    const posts = await query.lean();
    return posts.map((post) => serializeBlogPost(post));
}

export async function getBlogPostById(id: string) {
    await DBconnection();

    const post = await BlogPost.findById(id).lean();
    return post ? serializeBlogPost(post) : null;
}

export async function getBlogPostBySlug(slug: string, publishedOnly = true) {
    await DBconnection();

    const filter = publishedOnly ? { slug, isPublished: true } : { slug };
    const post = await BlogPost.findOne(filter).lean();

    return post ? serializeBlogPost(post) : null;
}
