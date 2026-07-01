"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { teacherApi } from "@/lib/api/teacherApi";
import { getReadableApiError } from "@/lib/api/apiErrors";

export function ClassroomJoinCard() {
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function join() {
    if (!joinCode.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const payload = await teacherApi.joinClassroom(joinCode.trim());
      setMessage(`Joined ${payload.classroom.name}. Assignments will appear here.`);
      setJoinCode("");
    } catch (caught) {
      setMessage(getReadableApiError(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
      <h2 className="text-xl font-black text-slate-950">Join your teacher’s classroom</h2>
      <p className="mt-2 text-sm font-semibold text-slate-600">Enter a classroom code to receive assignments from your teacher.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={joinCode}
          onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
          placeholder="Class code"
          className="focus-ring h-11 flex-1 rounded-2xl border border-blue-100 bg-white/85 px-4 text-sm font-black text-slate-900"
        />
        <Button onClick={join} disabled={loading || !joinCode.trim()}>
          {loading ? "Joining" : "Join"}
        </Button>
      </div>
      {message ? <p className="mt-3 text-sm font-bold text-blue-800">{message}</p> : null}
    </Card>
  );
}
