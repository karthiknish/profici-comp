import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils"; // Ensure cn is imported

// Centralized Markdown Component Styles
const markdownComponents = {
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-semibold mt-6 mb-4 pb-2 border-b" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-semibold mt-4 mb-3" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-base font-semibold mt-3 mb-2" {...props} />
  ),
  // Remove bottom margin from paragraphs for tighter line spacing
  p: ({ node, ...props }) => <p className="text-sm" {...props} />, // Removed mb-2
  // Reverted ul renderer to default (with bullets)
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-5 space-y-1 text-sm mb-3" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-5 space-y-1 text-sm mb-3" {...props} />
  ),
  li: ({ node, ...props }) => (
    // Use default text color (text-foreground) for better contrast
    <li className="" {...props} />
  ),
  // Reverted blockquote to default styling
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-border pl-4 py-1 my-3 text-muted-foreground italic"
      {...props}
    />
  ),
  // Removed custom em renderer, use default italics
  // em: ({ node, children, ...props }) => { ... },
  hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
  // Add table renderers using Shadcn UI components
  table: ({ node, ...props }) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg border">
      {" "}
      {/* Added border and overflow */}
      <table className="w-full" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-muted/50" {...props} />,
  tbody: ({ node, ...props }) => <tbody {...props} />,
  tr: ({ node, ...props }) => (
    <tr className="m-0 border-t p-0 even:bg-muted" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        /* Removed style={vscDarkPlus} to avoid forced dark background */
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      // For inline code, ensure children are treated as text content
      <code
        className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}
        {...props}
      >{` ${String(children)} `}</code> // Wrap in template literal just in case
    );
  },
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
