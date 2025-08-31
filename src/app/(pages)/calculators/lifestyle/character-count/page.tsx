"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface LetterDatum { letter: string; count: number }

const LETTERS: ReadonlyArray<string> = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const countWords = (text: string): number => {
    const t = text.trim();
    if (!t) return 0;
    return t.split(/\s+/g).filter(Boolean).length;
};

const countLines = (text: string): number => (text === "" ? 0 : text.split(/\n/).length);

export default function CharacterCounter(): JSX.Element {
    const [text, setText] = useState<string>("");

    const { chars, words, lines, lettersData, lettersDataSorted } = useMemo(() => {
        const chars = text.length;
        const words = countWords(text);
        const lines = countLines(text);

        const map: Record<string, number> = Object.create(null);
        for (const ch of text.toLowerCase()) {
            if (ch >= "a" && ch <= "z") {
                map[ch] = (map[ch] || 0) + 1;
            }
        }
        const lettersData: LetterDatum[] = LETTERS.map((L) => ({ letter: L, count: map[L.toLowerCase()] || 0 }));
        const lettersDataSorted = [...lettersData].sort((a, b) => b.count - a.count);

        return { chars, words, lines, lettersData, lettersDataSorted };
    }, [text]);

    const onCopy = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied text to clipboard");
        } catch {
            toast.error("Couldn't copy");
        }
    };

    const onClear = (): void => setText("");

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-6xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Character Counter</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Live counts for characters, words, lines — plus a letter‑frequency chart.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: input */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Type or paste your text</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Start typing here…"
                                className="min-h-[280px]"
                            />
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={onCopy}>Copy</Button>
                                <Button variant="secondary" onClick={onClear}>Clear</Button>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-3 gap-4">
                                <KPI label="Characters" value={String(chars)} />
                                <KPI label="Words" value={String(words)} />
                                <KPI label="Lines" value={String(lines)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: letters frequency */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Letter usage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="h-72">
                                {lettersData.some((d) => d.count > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={lettersData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="letter" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="count" name="Count" fill="hsl(var(--primary))" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">No letters yet</div>
                                )}
                            </div>

                            <div className="overflow-x-auto border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Letter</TableHead>
                                            <TableHead className="text-right">Count</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lettersDataSorted.slice(0, 10).map((row) => (
                                            <TableRow key={row.letter}>
                                                <TableCell>{row.letter}</TableCell>
                                                <TableCell className="text-right">{row.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Wrapper>
    );
}

function KPI({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border p-4 text-center">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
    );
}