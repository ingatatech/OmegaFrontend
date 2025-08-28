import React from "react";

export default function PDFViewer({ url }: { url: string }) {
	return <iframe src={url} title="PDF Viewer" width="100%" height="100%" style={{ minHeight: 350, border: "none" }} allow="autoplay" />;
}
