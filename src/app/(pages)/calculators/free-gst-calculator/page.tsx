"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Page() {
    const [amount, setAmount] = useState(10);
    const [gstPercentage, setGstPercentage] = useState(5);
    const [taxType, setTaxType] = useState("exclusive");
    const [gstAmount, setGstAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [actualAmount, setActualAmount] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const calculateGST = () => {
        // Validate fields
        if (amount <= 0 || gstPercentage <= 0) {
            setAlertMessage("Please fill in all fields correctly. Ensure none of the values are zero or empty.");
            return;
        } else {
            setAlertMessage(""); // Clear alert message
        }

        if (taxType === "exclusive") {
            const gst = (amount * gstPercentage) / 100;
            setGstAmount(parseFloat(gst.toFixed(2)));
            setTotalAmount(parseFloat((amount + gst).toFixed(2)));
            setActualAmount(amount);
        } else { // Inclusive GST
            const gst = (amount * gstPercentage) / (100 + gstPercentage);
            setGstAmount(parseFloat(gst.toFixed(2)));
            setTotalAmount(parseFloat(amount.toFixed(2)));
            setActualAmount(parseFloat((amount / (1 + gstPercentage / 100)).toFixed(2)));
        }
    };

    const handleCalculate = () => {
        calculateGST();
    };

    const handleClear = () => {
        setAmount(10);
        setGstPercentage(5);
        setTaxType("exclusive");
        setGstAmount(0);
        setTotalAmount(0);
        setActualAmount(0);
        setAlertMessage("");
    };

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Free GST Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        Introduces a free GST calculator made just for small businesses! With this tool, you'll be able to calculate GST in minutes without any complex math.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="gstPercentage">GST %</Label>
                            <Select value={gstPercentage.toString()} onValueChange={(value) => setGstPercentage(Number(value))}>
                                <SelectTrigger className="w-full" id="gstPercentage">
                                    <SelectValue className="w-full" placeholder="Select GST %" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem className="w-full" value="5">5%</SelectItem>
                                    <SelectItem className="w-full" value="12">12%</SelectItem>
                                    <SelectItem className="w-full" value="18">18%</SelectItem>
                                    <SelectItem className="w-full" value="28">28%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxType">Tax Type</Label>
                            <Select value={taxType} onValueChange={setTaxType}>
                                <SelectTrigger className="w-full" id="taxType">
                                    <SelectValue placeholder="Select Tax Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="exclusive">Exclusive</SelectItem>
                                    <SelectItem value="inclusive">Inclusive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {alertMessage && <div className="text-red-600 font-semibold mt-4">{alertMessage}</div>}

                    <div className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Actual Amount</TableCell>
                                    <TableCell className="text-right">₹{actualAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>GST Amount</TableCell>
                                    <TableCell className="text-right">₹{gstAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Total Amount</TableCell>
                                    <TableCell className="text-right font-semibold">₹{totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <Button onClick={handleCalculate}>Calculate</Button>
                        <Button variant="outline" onClick={handleClear}>Clear</Button>
                    </div>

                    {/* Pie Chart */}
                    <div className="mt-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: "Actual Amount", value: actualAmount },
                                        { name: "GST Amount", value: gstAmount },
                                    ]}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                >
                                    <Cell fill="#0D74FF" />
                                    <Cell fill="#FF5733" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}