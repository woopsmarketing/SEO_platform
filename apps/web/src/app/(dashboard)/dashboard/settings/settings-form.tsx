"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";

export function SettingsForm({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.updateUser({
      data: { display_name: name },
    });

    if (error) {
      setMessage("저장에 실패했습니다: " + error.message);
    } else {
      // profiles 테이블도 업데이트
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ display_name: name }).eq("id", user.id);
      }
      setMessage("저장되었습니다.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">이름</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" />
      </div>
      <Button onClick={handleSave} disabled={saving || name === currentName}>
        {saving ? "저장 중..." : "저장"}
      </Button>
      {message && (
        <p className={`text-sm ${message.includes("실패") ? "text-red-500" : "text-green-600"}`}>{message}</p>
      )}
    </div>
  );
}
