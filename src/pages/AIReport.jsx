import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatISTDate, formatISTTime, fetchScanByIdentifier } from "@/lib/reportUtils";
import { Download, Loader2, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import SeverityBadge from "@/components/medical/SeverityBadge";
import MedicalDisclaimer from "@/components/medical/MedicalDisclaimer";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

export default function AIReport() {
  const params = useParams();
  const identifier = params.reportId || params.id;
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let active = true;
    fetchScanByIdentifier(identifier)
      .then((data) => {
        if (!active) return;
        setScan(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, [identifier]);

  const reportId = scan?.report_id || "";
  // QR encodes a deep-link URL to the permanent Report ID route (no internal/db id).
  // Uses the current app origin so it resolves correctly in preview, after publish,
  // and on mobile. Lookup is RLS-protected, so a scanned/guessed id cannot open
  // another user's report.
  const qrData = scan && reportId
    ? `${window.location.origin}/report/${reportId}`
    : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

  const downloadPDF = async () => {
    if (!scan) return;
    setGenerating(true);
    try {
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.onerror = resolve;
        qrImg.src = qrUrl;
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFillColor(30, 80, 162);
      doc.rect(0, 0, pageWidth, 35, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("NeuroSync", 20, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("AI-Powered Dermatology Screening Report", 20, 26);
      doc.text(`Report ID: ${reportId}`, 20, 31);

      // QR Code
      if (qrImg.complete && qrImg.naturalWidth > 0) {
        try {
          doc.addImage(qrImg, "PNG", pageWidth - 50, 5, 30, 30);
        } catch (e) {
          /* skip QR if CORS fails */
        }
      }

      // Report Info
      y = 50;
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Report Information", 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Date: ${scan.created_date ? formatISTDate(scan.created_date) : "N/A"}`, 20, y);
      doc.text(`Time: ${scan.created_date ? formatISTTime(scan.created_date) : "N/A"}`, 20, y + 6);
      doc.text(`Report Number: ${reportId}`, 20, y + 12);

      // Diagnosis
      y += 30;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, pageWidth - 20, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Diagnosis Summary", 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Condition: ${scan.condition_name || "Not determined"}`, 20, y);
      y += 7;
      doc.text(`Confidence: ${scan.confidence || 0}%`, 20, y);
      y += 7;
      doc.text(`Severity: ${scan.severity || "unknown"}`, 20, y);

      // AI Analysis
      if (scan.description || scan.full_analysis) {
        y += 12;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("AI Analysis", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const desc = (scan.description || scan.full_analysis || "").slice(0, 500);
        const lines = doc.splitTextToSize(desc, pageWidth - 40);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 5;
      }

      // Symptoms
      if (scan.symptoms) {
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Symptoms", 20, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const symLines = doc.splitTextToSize(scan.symptoms.slice(0, 300), pageWidth - 40);
        doc.text(symLines, 20, y);
        y += symLines.length * 5 + 5;
      }

      // Guidance
      if (scan.self_care || scan.precautions) {
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Personalized Guidance", 20, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const guide = (scan.self_care || scan.precautions || "").slice(0, 300);
        const guideLines = doc.splitTextToSize(guide, pageWidth - 40);
        doc.text(guideLines, 20, y);
        y += guideLines.length * 5 + 5;
      }

      // When to see doctor
      if (scan.when_to_see_doctor) {
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("When to Consult a Dermatologist", 20, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const docLines = doc.splitTextToSize(scan.when_to_see_doctor.slice(0, 300), pageWidth - 40);
        doc.text(docLines, 20, y);
        y += docLines.length * 5 + 5;
      }

      // Disclaimer
      y = Math.max(y + 10, doc.internal.pageSize.getHeight() - 35);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, pageWidth - 20, y);
      y += 7;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      const disclaimer =
        "NeuroSync is an AI-powered screening assistant designed for educational and early screening purposes only. It does not replace professional medical diagnosis, treatment, or advice. Always consult a qualified dermatologist regarding any medical condition.";
      const discLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
      doc.text(discLines, 20, y);

      doc.save(`NeuroSync_Report_${reportId}.pdf`);
      toast.success("Report downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF");
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground">Report not found.</p>
        <Link to="/ScanHistory">
          <Button variant="outline" className="mt-3">Back to History</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Report Preview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        {/* Report Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">NeuroSync</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI-Powered Dermatology Screening Report
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Report ID: {reportId}</p>
            </div>
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-20 h-20 rounded-xl bg-white p-1.5 border border-border"
            />
          </div>
        </div>

        {/* Report Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Date</p>
              <p className="text-sm font-bold">
                {scan.created_date ? formatISTDate(scan.created_date) : "--"}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Time</p>
              <p className="text-sm font-bold">
                {scan.created_date ? formatISTTime(scan.created_date) : "--"}
              </p>
            </div>
          </div>

          {scan.image_url && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Scanned Image
              </p>
              <img
                src={scan.image_url}
                alt="Scan"
                className="w-full max-w-xs rounded-xl border border-border"
              />
            </div>
          )}

          <div className="bg-secondary/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Diagnosis</p>
              <SeverityBadge severity={scan.severity} size="sm" />
            </div>
            <h3 className="text-lg font-bold">{scan.condition_name || "Not determined"}</h3>
            <p className="text-3xl font-bold text-primary mt-1">
              {scan.confidence ? `${scan.confidence}%` : "--"}
              <span className="text-sm text-muted-foreground ml-1">confidence</span>
            </p>
          </div>

          {(scan.description || scan.full_analysis) && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                AI Analysis
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {scan.description || scan.full_analysis}
              </p>
            </div>
          )}

          {scan.symptoms && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Symptoms</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{scan.symptoms}</p>
            </div>
          )}

          {(scan.self_care || scan.precautions) && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                Personalized Guidance
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {scan.self_care || scan.precautions}
              </p>
            </div>
          )}

          {scan.when_to_see_doctor && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                When to Consult a Dermatologist
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">{scan.when_to_see_doctor}</p>
            </div>
          )}
        </div>

        {/* Report Footer */}
        <div className="border-t border-border p-4 bg-secondary/10">
          <div className="flex items-start gap-2">
            <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed italic">
              NeuroSync is an AI-powered screening assistant designed for educational and early
              screening purposes only. It does not replace professional medical diagnosis, treatment,
              or advice. Always consult a qualified dermatologist regarding any medical condition.
            </p>
          </div>
        </div>
      </motion.div>

      <MedicalDisclaimer />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={downloadPDF}
          disabled={generating}
          className="rounded-xl h-10 bg-primary hover:bg-primary/90 flex-1"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {generating ? "Generating..." : "Download PDF Report"}
        </Button>
        <Link to={`/DiseaseDetail/${scan.report_id || scan.id}`}>
          <Button variant="outline" className="rounded-xl h-10">
            <FileText className="w-4 h-4 mr-1.5" /> View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}