import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Specific component for rendering parsed table data
const MarkdownTableRenderer = ({ tableData }) => {
  if (!tableData || tableData.length === 0) return null;
  const headers = Object.keys(tableData[0]);
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header, cellIndex) => (
                <TableCell key={cellIndex} className="break-words">
                  {/* Render cell content as plain text or basic markdown if needed */}
                  <ReactMarkdown
                    className="prose-sm dark:prose-invert max-w-none"
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    // Optionally simplify components for table cells if complex markdown isn't expected
                    components={{ p: React.Fragment }} // Example: render paragraphs as plain text
                  >
                    {row[header]}
                  </ReactMarkdown>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarkdownTableRenderer;
