"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  company: string | null;
  service_type: string;
  message: string;
  status: string;
  admin_note: string | null;
  created_at: string;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "대기", className: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "처리중", className: "bg-blue-100 text-blue-800" },
  resolved: { label: "완료", className: "bg-green-100 text-green-800" },
  closed: { label: "닫힘", className: "bg-muted text-muted-foreground" },
};

export function InquiryList({ inquiries }: { inquiries: Inquiry[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (inquiries.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">아직 문의가 없습니다.</p>;
  }

  return (
    <div className="space-y-2">
      {inquiries.map((inq) => (
        <div key={inq.id} className="rounded-md border">
          <button
            onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
            className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">
                {inq.name} — {inq.service_type}
              </p>
              <p className="text-xs text-muted-foreground">
                {inq.email} &middot; {new Date(inq.created_at).toLocaleDateString("ko-KR")}
              </p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusLabels[inq.status]?.className}`}>
              {statusLabels[inq.status]?.label}
            </span>
          </button>

          {expandedId === inq.id && (
            <InquiryDetail inquiry={inq} />
          )}
        </div>
      ))}
    </div>
  );
}

function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    await fetch(`/api/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setUpdating(false);
  }

  return (
    <div className="border-t p-4 space-y-3">
      {inquiry.company && (
        <p className="text-sm"><span className="font-medium">회사:</span> {inquiry.company}</p>
      )}
      <div>
        <p className="text-sm font-medium">문의 내용:</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{inquiry.message}</p>
      </div>
      <div className="flex gap-2">
        {inquiry.status !== "in_progress" && (
          <Button size="sm" variant="outline" onClick={() => updateStatus("in_progress")} disabled={updating}>
            처리중으로 변경
          </Button>
        )}
        {inquiry.status !== "resolved" && (
          <Button size="sm" onClick={() => updateStatus("resolved")} disabled={updating}>
            완료 처리
          </Button>
        )}
        {inquiry.status !== "closed" && (
          <Button size="sm" variant="ghost" onClick={() => updateStatus("closed")} disabled={updating}>
            닫기
          </Button>
        )}
      </div>
    </div>
  );
}
