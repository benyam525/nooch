import { DocumentList } from "@/components/methodology/DocumentList";
import { FileUpload } from "@/components/methodology/FileUpload";

// Demo documents
const demoDocuments = [
  {
    id: "1",
    fileName: "nutrition-fundamentals.pdf",
    fileType: "application/pdf",
    fileSize: 2458000,
    status: "READY",
    chunkCount: 45,
    title: "Nutrition Fundamentals Guide",
    description: "Core principles of balanced nutrition",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "2",
    fileName: "meal-planning-templates.pdf",
    fileType: "application/pdf",
    fileSize: 1834000,
    status: "READY",
    chunkCount: 32,
    title: "Meal Planning Templates",
    description: "Weekly meal planning guides",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "3",
    fileName: "macro-tracking-guide.docx",
    fileType: "application/msword",
    fileSize: 456000,
    status: "PROCESSING",
    chunkCount: 0,
    title: "Macro Tracking Guide",
    description: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export default function MethodologyPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark">
          My Methodology
        </h1>
        <p className="mt-1 font-mono text-sm text-nooch-gray">
          <span className="text-coral-400">$</span> nooch upload --train-ai --your-style
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-nooch-dark">
            Upload New Document
          </h2>
          <FileUpload />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-nooch-dark">
            Uploaded Documents ({demoDocuments.length})
          </h2>
          <DocumentList documents={demoDocuments} />
        </div>
      </div>
    </div>
  );
}
