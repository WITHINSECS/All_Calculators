"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper"

export default function Page() {
    const [amount, setAmount] = useState(10)
    const [gstPercentage, setGstPercentage] = useState(5)
    const [taxType, setTaxType] = useState("exclusive")
    const [gstAmount, setGstAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)

    const calculateGST = () => {
        if (taxType === "exclusive") {
            const gst = (amount * gstPercentage) / 100;
            setGstAmount(parseFloat(gst.toFixed(2)));
            setTotalAmount(parseFloat((amount + gst).toFixed(2)));
        } else {
            const gst = (amount * gstPercentage) / (100 + gstPercentage);
            setGstAmount(parseFloat(gst.toFixed(2)));
            setTotalAmount(parseFloat(amount.toFixed(2)));
        }
    };

    const handleCalculate = () => {
        calculateGST()
    }

    const handleClear = () => {
        setAmount(10)
        setGstPercentage(5)
        setTaxType("exclusive")
        setGstAmount(0)
        setTotalAmount(0)
    }

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Free GST Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        Introduces a free GST calculator made just for small businesses! With this tool, youll be able to calculate GST in minutes without any complex math.
                    </p>
                </div>
                <div className=" max-w-4xl mx-auto">
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
                            <Label htmlFor="taxType">Tax</Label>
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
                                    <TableCell className="text-right">₹{amount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>GST Amount</TableCell>
                                    <TableCell className="text-right">₹{gstAmount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Total Amount</TableCell>
                                    <TableCell className="text-right font-semibold">₹{totalAmount}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-6 flex space-x-4">
                        <Button onClick={handleCalculate}>Calculate</Button>
                        <Button variant="outline" onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}