"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  status: string;
  tags: string[];
  cover_image_url: string | null;
}

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [category, setCategory] = useState(post?.category ?? "blog");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = (t: string) => {
    setTitle(t);
    if (!isEdit) {
      setSlug(
        t.toLowerCase()
          .replace(/[^a-z0-9가-힣\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 80)
      );
    }
  };

  async function handleSave(status: string) {
    setSaving(true);
    setError("");

    const body = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category,
      status,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      cover_image_url: coverImage || null,
    };

    const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "저장에 실패했습니다.");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!isEdit || !confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <Card>
        <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">제목 *</label>
            <Input value={title} onChange={(e) => autoSlug(e.target.value)} placeholder="글 제목" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">슬러그 *</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">카테고리</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="blog">블로그</option>
                <option value="guide">가이드</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">태그 (쉼표 구분)</label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="SEO, 메타태그" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">요약</label>
            <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="게시글 요약 (목록에 표시)" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">커버 이미지 URL</label>
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>본문 *</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[300px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="글 내용을 작성하세요..."
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={() => handleSave("draft")} variant="outline" disabled={saving}>
          {saving ? "저장 중..." : "임시 저장"}
        </Button>
        <Button onClick={() => handleSave("published")} disabled={saving}>
          {saving ? "저장 중..." : isEdit ? "수정 및 발행" : "발행"}
        </Button>
        {isEdit && (
          <Button variant="destructive" onClick={handleDelete} className="ml-auto">
            삭제
          </Button>
        )}
      </div>
    </div>
  );
}
