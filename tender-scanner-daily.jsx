import { useState } from "react";

const RECIPIENTS = ["robikigli1@gmail.com", "Robi.kigli@g1-group.com"];

const SEARCH_QUERIES = [
  'site:mr.gov.il "CCTV" OR "מצלמות" מכרז 2026',
  'site:mr.gov.il "בקרת כניסה" OR "ביומטריה" מכרז 2026',
  'site:mr.gov.il "BMS" OR "בקרת מבנה" מכרז 2026',
  'site:mr.gov.il "גילוי אש" OR "כיבוי אש" מכרז 2026',
  'site:mr.gov.il "מולטימדיה" OR "AV" מכרז 2026',
  'site:mr.gov.il "טלפוניה" OR "VoIP" OR "IPT" מכרז 2026',
  'site:mr.gov.il "מתח נמוך" מכרז 2026',
  'site:mr.gov.il "כריזה" OR "אינטרקום" מכרז 2026',
  'site:govi.co.il "CCTV" OR "מצלמות" OR "בקרת כניסה" 2026',
  'site:govi.co.il "BMS" OR "גילוי אש" OR "מתח נמוך" 2026',
  'site:govo.co.il "CCTV" OR "מצלמות" OR "אבטחה" 2026',
  'site:wizbiz.co.il "מצלמות" OR "CCTV" OR "בקרת כניסה" 2026',
  'עירייה מכרז "בקרת כניסה" OR "מצלמות" 2026',
  'בית חולים מכרז CCTV OR BMS 2026',
  'מועצה מקומית מכרז טלפוניה VoIP IPT 2026',
];

const TOPICS = [
  { key: "cctv",       label: "📹 CCTV / מצלמות",      color: "#1565c0" },
  { key: "access",     label: "🔐 בקרת כניסה",          color: "#2e7d32" },
  { key: "bms",        label: "🏢 BMS / בקרת מבנה",     color: "#6a1b9a" },
  { key: "fire",       label: "🔥 גילוי אש",            color: "#c62828" },
  { key: "multimedia", label: "🖥️ מולטימדיה / AV",      color: "#e65100" },
  { key: "telephony",  label: "📞 טלפוניה / VoIP",      color: "#00695c" },
  { key: "lowvoltage", label: "⚡ מתח נמוך / חשמל",     color: "#1565c0" },
  { key: "pa",         label: "🔊 כריזה / אינטרקום",    color: "#827717" },
  { key: "other",      label: "📋 אחר",                  color: "#455a64" },
];

const topicLabel = (key) => TOPICS.find(t => t.key === key)?.label || "📋 אחר";
const topicColor = (key) => TOPICS.find(t => t.key === key)?.color || "#455a64";

const classify = (text) => {
  const t = (text || "").toLowerCase();
  if (/cctv|מצלמ|טמ.?ס|nvr|dvr|vms/.test(t)) return "cctv";
  if (/בקרת כניסה|ביומטרי|rfid|כרטיס חכם/.test(t)) return "access";
  if (/bms|בקרת מבנה|bacnet|ibms|מבנה חכם/.test(t)) return "bms";
  if (/גילוי אש|כיבוי אש|ספרינקל|vesda|אש ועשן/.test(t)) return "fire";
  if (/מולטימדי|שיקוף|וידאו קונפ|digital signage/.test(t)) return "multimedia";
  if (/טלפוני|voip|ipt|מרכזי|pabx|call center/.test(t)) return "telephony";
  if (/מתח נמוך|ups|גנרטור|לוח חשמל|תאורה/.test(t)) return "lowvoltage";
  if (/כריזה|אינטרקום|public address/.test(t)) return "pa";
  return "other";
};

const S = { IDLE: "idle", SCANNING: "scanning", READY: "ready" };

export default function App() {
  const [phase, setPhase]         = useState(S.IDLE);
  const [progress, setProgress]   = useState(0);
  const [currentQ, setCurrentQ]   = useState("");
  const [results, setResults]     = useState([]);
  const [log, setLog]             = useState([]);
  const [copied, setCopied]       = useState(false);

  const addLog = (msg, type = "info") =>
    setLog(p => [...p, { msg, type, t: new Date().toLocaleTimeString("he-IL") }]);

  /* ── Scan ── */
  const runScan = async () => {
    setPhase(S.SCANNING);
    setResults([]); setLog([]); setProgress(0); setCopied(false);
    addLog("🔍 מתחיל סריקה של כל מאגרי המכרזים...");

    const found = [];
    for (let i = 0; i < SEARCH_QUERIES.length; i++) {
      const q = SEARCH_QUERIES[i];
      setCurrentQ(q);
      setProgress(Math.round(((i + 1) / SEARCH_QUERIES.length) * 100));
      addLog(`שאילתה ${i + 1}/${SEARCH_QUERIES.length}: ${q.slice(0, 55)}…`);

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            system: `אתה סוכן מכרזים. בצע את החיפוש המבוקש והחזר JSON בלבד, ללא כל טקסט אחר.
פורמט חובה: {"tenders":[{"id":"...","title":"...","publisher":"...","date":"DD/MM/YYYY","deadline":"DD/MM/YYYY","url":"..."}]}
אם אין ממצאים: {"tenders":[]}
כלול רק מכרזים מ-7 הימים האחרונים. אל תמציא נתונים.`,
            messages: [{ role: "user", content: `חפש: ${q}\nהחזר JSON בלבד.` }],
          }),
        });
        const data = await res.json();
        const txt = data.content?.find(b => b.type === "text")?.text || "";
        try {
          const clean = txt.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          if (parsed.tenders?.length) {
            const tagged = parsed.tenders.map(t => ({
              ...t,
              topic: classify(t.title + " " + (t.publisher || "")),
              source: q.includes("mr.gov.il") ? "מרכב\"ת" :
                      q.includes("govi")       ? "גובי" :
                      q.includes("govo")       ? "גובו" :
                      q.includes("wizbiz")     ? "WizBiz" : "חיפוש כללי",
            }));
            found.push(...tagged);
            addLog(`✅ נמצאו ${tagged.length} מכרזים`, "success");
          }
        } catch { /* no JSON */ }
      } catch (e) {
        addLog(`⚠️ שגיאה: ${e.message}`, "warn");
      }
      await new Promise(r => setTimeout(r, 250));
    }

    // deduplicate
    const unique = found.filter((item, idx, arr) =>
      arr.findIndex(t => t.title === item.title || (t.id && t.id === item.id)) === idx
    );
    setResults(unique);
    setPhase(S.READY);
    addLog(`📊 סה"כ ${unique.length} מכרזים ייחודיים — מוכן לשליחה`, "success");
  };

  /* ── Build prompt for Claude to send email ── */
  const buildEmailPrompt = () => {
    const today = new Date().toLocaleDateString("he-IL", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const rows = results.map(t =>
      `| ${t.title || "—"} | ${t.publisher || "—"} | ${topicLabel(t.topic)} | ${t.date || "—"} | ${t.deadline || "—"} | ${t.url || "—"} |`
    ).join("\n");

    const summary = TOPICS
      .map(tp => ({ ...tp, count: results.filter(r => r.topic === tp.key).length }))
      .filter(tp => tp.count > 0)
      .map(tp => `${tp.label}: ${tp.count}`)
      .join(" | ");

    return `שלח מייל HTML ל-${RECIPIENTS.join(" ול-")} עם הפרטים הבאים:

נושא: 📋 דוח מכרזים יומי — ${today} | ${results.length} מכרזים

תוכן המייל (HTML יפה, RTL, עברית):
- כותרת: "דוח מכרזים יומי — מתח נמוך, בקרה וביטחון"
- תאריך: ${today}
- סיכום: ${summary}
- טבלת מכרזים מלאה:

| שם המכרז | גוף מפרסם | תחום | תאריך פרסום | תאריך הגשה | קישור |
|----------|----------|------|------------|-----------|-------|
${rows}

- כותרת תחתונה: "הדוח נוצר אוטומטית | מאגרים: מרכב"ת, גובי, גובו, WizBiz, נמ"ר ועוד"`;
  };

  /* ── Copy prompt to clipboard ── */
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(buildEmailPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { /* clipboard blocked */ }
  };

  const topicCounts = {};
  results.forEach(r => { topicCounts[r.topic] = (topicCounts[r.topic] || 0) + 1; });

  /* ── UI ── */
  return (
    <div style={{
      minHeight: "100vh", background: "#0f1923", color: "#e8eaf0",
      fontFamily: "'Segoe UI', Arial, sans-serif", direction: "rtl", padding: 24,
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: "#4fc3f7" }}>
            🔍 סוכן מכרזים — מתח נמוך, בקרה וביטחון
          </h1>
          <p style={{ margin: "6px 0 0", color: "#78909c", fontSize: 13 }}>
            סריקה יומית · {SEARCH_QUERIES.length} שאילתות · 35+ מאגרים → {RECIPIENTS.join(" | ")}
          </p>
        </div>

        {/* Main card */}
        <div style={{
          background: "#1a2535", border: "1px solid #263545",
          borderRadius: 12, padding: 24, marginBottom: 20,
        }}>
          {/* Progress */}
          {phase === S.SCANNING && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#78909c", marginBottom: 6 }}>
                <span>סורק מאגרים…</span><span>{progress}%</span>
              </div>
              <div style={{ background: "#0f1923", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{
                  width: `${progress}%`, height: "100%", borderRadius: 4,
                  background: "linear-gradient(90deg,#1565c0,#4fc3f7)", transition: "width .3s",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#455a64", marginTop: 5, direction: "ltr", textAlign: "left" }}>
                {currentQ.slice(0, 72)}…
              </div>
            </div>
          )}

          {/* Ready banner */}
          {phase === S.READY && (
            <div style={{
              background: "#1b3a2a", border: "1px solid #2e7d52", borderRadius: 8,
              padding: "14px 18px", marginBottom: 20, color: "#66bb6a",
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                ✅ הסריקה הושלמה — {results.length} מכרזים נמצאו
              </div>
              <div style={{ fontSize: 13, color: "#a5d6a7" }}>
                לשליחת המייל: לחץ <strong>"העתק הוראה לשליחה"</strong> ואז הדבק אותה בצ'אט עם Claude למטה ↓
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={runScan} disabled={phase === S.SCANNING}
              style={{
                flex: 1, minWidth: 180, padding: "13px 0", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: phase === S.SCANNING ? "not-allowed" : "pointer",
                background: phase === S.SCANNING ? "#263545" : "linear-gradient(135deg,#1565c0,#0d47a1)",
                color: phase === S.SCANNING ? "#546e7a" : "white",
              }}>
              {phase === S.SCANNING ? "⏳ סורק…" : phase === S.READY ? "🔄 סריקה חדשה" : "▶ הפעל סריקה"}
            </button>

            {phase === S.READY && (
              <button onClick={copyPrompt}
                style={{
                  flex: 1, minWidth: 200, padding: "13px 0", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  background: copied ? "linear-gradient(135deg,#2e7d32,#1b5e20)" : "linear-gradient(135deg,#00897b,#00695c)",
                  color: "white",
                }}>
                {copied ? "✅ הועתק! הדבק בצ'אט" : "📋 העתק הוראה לשליחה"}
              </button>
            )}
          </div>
        </div>

        {/* Topic summary pills */}
        {results.length > 0 && (
          <div style={{
            background: "#1a2535", border: "1px solid #263545",
            borderRadius: 12, padding: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, color: "#78909c", marginBottom: 12 }}>
              📊 {results.length} מכרזים לפי תחום
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {TOPICS.filter(t => topicCounts[t.key]).map(t => (
                <div key={t.key} style={{
                  background: t.color + "25", border: `1px solid ${t.color}50`,
                  borderRadius: 6, padding: "5px 11px", fontSize: 13,
                }}>
                  <span style={{ color: t.color, fontWeight: 700 }}>{topicCounts[t.key]}</span>
                  {"  "}{t.label}
                </div>
              ))}
            </div>

            {/* Results list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  background: "#0f1923", border: "1px solid #1e2d3d",
                  borderRadius: 8, padding: "11px 14px",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 4, minHeight: 38, borderRadius: 2, flexShrink: 0, marginTop: 3,
                    background: topicColor(r.topic),
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e8eaf0", marginBottom: 4 }}>
                      {r.title || "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "#78909c", display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span>🏢 {r.publisher || "—"}</span>
                      {r.date     && <span>📅 {r.date}</span>}
                      {r.deadline && <span style={{ color: "#ef9a9a" }}>⏰ {r.deadline}</span>}
                      <span style={{ color: "#455a64" }}>{r.source}</span>
                    </div>
                  </div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#4fc3f7", fontSize: 12, textDecoration: "none", flexShrink: 0 }}>
                      ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log */}
        {log.length > 0 && (
          <div style={{
            background: "#0d1520", border: "1px solid #1e2d3d",
            borderRadius: 10, padding: 14,
          }}>
            <div style={{ fontSize: 11, color: "#455a64", marginBottom: 6 }}>לוג סריקה</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 180, overflowY: "auto" }}>
              {log.map((e, i) => (
                <div key={i} style={{
                  fontSize: 12, display: "flex", gap: 8,
                  color: e.type === "success" ? "#66bb6a" : e.type === "warn" ? "#ffcc02" : "#78909c",
                }}>
                  <span style={{ color: "#37474f", flexShrink: 0 }}>{e.t}</span>
                  <span>{e.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idle instructions */}
        {phase === S.IDLE && (
          <div style={{
            background: "#1a2535", border: "1px solid #263545", borderRadius: 10,
            padding: 18, fontSize: 13, color: "#78909c", lineHeight: 1.9, marginTop: 16,
          }}>
            <div style={{ color: "#4fc3f7", fontWeight: 600, marginBottom: 8 }}>כיצד להשתמש</div>
            <div>1. לחץ <strong style={{ color: "#e8eaf0" }}>הפעל סריקה</strong> — הכלי יסרוק את כל המאגרים</div>
            <div>2. לאחר הסריקה לחץ <strong style={{ color: "#e8eaf0" }}>העתק הוראה לשליחה</strong></div>
            <div>3. חזור לצ'אט עם Claude והדבק את ההוראה — Claude ישלח לשני המיילים</div>
            <div style={{ color: "#455a64", fontSize: 12, marginTop: 8 }}>
              💡 סמן סימנייה לשיחה זו לגישה מהירה כל בוקר
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
