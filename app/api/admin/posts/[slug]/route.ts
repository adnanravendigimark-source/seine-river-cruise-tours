import { NextResponse } from "next/server";
import { getPosts, getPost, savePosts, type Post } from "@/lib/posts";
import { getSession } from "@/lib/session";
import { dbErrorMessage } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const body = (await req.json()) as Post;
  const posts = await getPosts();
  const idx = posts.findIndex((p) => p.slug === params.slug);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  posts[idx] = { ...body, slug: params.slug, content: body.content || [] };
  try {
    await savePosts(posts);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete." }, { status: 403 });
  }

  const posts = await getPosts();
  const next = posts.filter((p) => p.slug !== params.slug);
  if (next.length === posts.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    await savePosts(next);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
