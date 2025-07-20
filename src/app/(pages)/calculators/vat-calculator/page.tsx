"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper"

export default function VATCalculator() {
    const [amount, setAmount] = useState(200)
    const [vatPercentage, setVatPercentage] = useState(20)
    const [operation, setOperation] = useState("exclude")
    const [vatExcluded, setVatExcluded] = useState<number>(0)
    const [netAmount, setNetAmount] = useState<number>(0)

    const calculateVAT = () => {
        if (operation === "exclude") {
            const vatAmount = (amount * vatPercentage) / 100
            setVatExcluded(vatAmount)
            setNetAmount(amount - vatAmount)
        } else { // add VAT
            const totalAmount = amount * (1 + vatPercentage / 100)
            setVatExcluded(totalAmount - amount)
            setNetAmount(amount)
        }
    }

    const handleCalculate = () => {
        calculateVAT()
    }

    const handleClear = () => {
        setAmount(200)
        setVatPercentage(20)
        setOperation("exclude")
        setVatExcluded(0)
        setNetAmount(0)
    }

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Pension Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-t-lg grid md:grid-cols-2 grid-cols-1 gap-5 items-center space-x-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount:</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vatPercentage">VAT, %:</Label>
                            <Input
                                id="vatPercentage"
                                type="number"
                                value={vatPercentage}
                                onChange={(e) => setVatPercentage(Number(e.target.value))}
                            />
                        </div>
                        <RadioGroup value={operation} onValueChange={setOperation} className="flex space-x-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="exclude" id="exclude" />
                                <Label htmlFor="exclude">exclude VAT</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="add" id="add" />
                                <Label htmlFor="add">add VAT</Label>
                            </div>
                        </RadioGroup>
                        <Button onClick={handleCalculate}>Calculate</Button>
                    </div>
                    <div className="md:mt-4 bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="py-5">Amount</TableHead>
                                    <TableHead className="py-5">VAT, %</TableHead>
                                    <TableHead className="py-5">Operation</TableHead>
                                    <TableHead className="py-5">VAT excluded</TableHead>
                                    <TableHead className="py-5">Net amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Label>Amount:</Label>
                                        <div>{amount.toFixed(2)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Label>VAT, %:</Label>
                                        <div>{vatPercentage.toFixed(2)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Label>Operation:</Label>
                                        <div>{operation}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Label>VAT excluded:</Label>
                                        <div>{vatExcluded}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Label>Net amount:</Label>
                                        <div>{netAmount}</div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-4">
                        <Button variant="outline" onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}