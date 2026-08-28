export function downloadBase64Pdf(base64Data: string, filename: string): void {
  try {
    // 1. Strip data URI scheme if present (e.g. "data:application/pdf;base64,...")
    let cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "");

    // 2. Remove any whitespace or newline characters inserted during encoding
    cleanBase64 = cleanBase64.replace(/\s/g, "");

    // 3. Decode base64
    const binaryString = window.atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes.buffer], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
    console.log("✅ PDF downloaded successfully:", filename);
  } catch (error) {
    console.error("❌ Failed to decode or download PDF Base64 string:", error);
  }
}