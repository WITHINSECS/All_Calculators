"use client";

import { useEffect, useMemo, useRef, useState, type ClipboardEvent } from "react";
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link2,
    List,
    ListOrdered,
    Pilcrow,
    Quote,
    Underline,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolbarState = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    unordered: boolean;
    ordered: boolean;
    block: "p" | "h2" | "h3" | "blockquote";
};

const defaultToolbarState: ToolbarState = {
    bold: false,
    italic: false,
    underline: false,
    unordered: false,
    ordered: false,
    block: "p",
};

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write the article body here...",
    className,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [toolbarState, setToolbarState] = useState<ToolbarState>(defaultToolbarState);

    const isEmpty = useMemo(() => {
        const textValue = value.replace(/<[^>]+>/g, "").trim();
        return textValue.length === 0;
    }, [value]);

    useEffect(() => {
        if (!editorRef.current || editorRef.current.innerHTML === value) {
            return;
        }

        editorRef.current.innerHTML = value;
    }, [value]);

    useEffect(() => {
        try {
            document.execCommand("styleWithCSS", false, "false");
        } catch {
            // Older editing APIs can fail silently in some environments.
        }
    }, []);

    useEffect(() => {
        const syncToolbarState = () => {
            const editor = editorRef.current;
            const selection = document.getSelection();
            const anchorNode = selection?.anchorNode ?? null;

            if (!editor || !anchorNode || !editor.contains(anchorNode)) {
                setToolbarState(defaultToolbarState);
                return;
            }

            const block = (document.queryCommandValue("formatBlock") || "p")
                .toString()
                .replace(/[<>]/g, "")
                .toLowerCase();

            setToolbarState({
                bold: document.queryCommandState("bold"),
                italic: document.queryCommandState("italic"),
                underline: document.queryCommandState("underline"),
                unordered: document.queryCommandState("insertUnorderedList"),
                ordered: document.queryCommandState("insertOrderedList"),
                block:
                    block === "h2" || block === "h3" || block === "blockquote"
                        ? block
                        : "p",
            });
        };

        document.addEventListener("selectionchange", syncToolbarState);

        return () => {
            document.removeEventListener("selectionchange", syncToolbarState);
        };
    }, []);

    const syncContent = () => {
        onChange(editorRef.current?.innerHTML ?? "");
    };

    const runCommand = (command: string, valueArg?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, valueArg);
        syncContent();
    };

    const setBlock = (tag: ToolbarState["block"]) => {
        runCommand("formatBlock", `<${tag}>`);
    };

    const handleAddLink = () => {
        const href = window.prompt("Enter a full URL");

        if (!href) {
            return;
        }

        runCommand("createLink", href);
    };

    const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        syncContent();
    };

    return (
        <div className={cn("space-y-0", className)}>
            <div className="flex flex-wrap gap-2 rounded-t-lg border border-b-0 bg-muted/40 p-3">
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "p" ? "default" : "outline"}
                    onClick={() => setBlock("p")}
                >
                    <Pilcrow className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "h2" ? "default" : "outline"}
                    onClick={() => setBlock("h2")}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "h3" ? "default" : "outline"}
                    onClick={() => setBlock("h3")}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.bold ? "default" : "outline"}
                    onClick={() => runCommand("bold")}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.italic ? "default" : "outline"}
                    onClick={() => runCommand("italic")}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.underline ? "default" : "outline"}
                    onClick={() => runCommand("underline")}
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.unordered ? "default" : "outline"}
                    onClick={() => runCommand("insertUnorderedList")}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.ordered ? "default" : "outline"}
                    onClick={() => runCommand("insertOrderedList")}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "blockquote" ? "default" : "outline"}
                    onClick={() => setBlock("blockquote")}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={handleAddLink}>
                    <Link2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="relative">
                {isEmpty ? (
                    <div className="pointer-events-none absolute top-4 left-4 text-sm text-muted-foreground">
                        {placeholder}
                    </div>
                ) : null}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className={cn(
                        "min-h-[280px] rounded-b-lg border px-4 py-4 text-sm leading-7 outline-none",
                        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic",
                        "[&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold",
                        "[&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold",
                        "[&_a]:text-primary [&_a]:underline",
                        "[&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
                        className
                    )}
                    onInput={syncContent}
                    onPaste={handlePaste}
                />
            </div>
        </div>
    );
}
