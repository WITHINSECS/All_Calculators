"use client"
import Wrapper from '@/app/Wrapper'
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts"

interface LineChartData {
    month: number
    principalPaid: number
    interestPaid: number
}

const COLORS = ["#0D74FF", "#FF5733"]

const Page = () => {
    // numeric states (used for actual calculation)
    const [amount, setAmount] = useState(0)
    const [tenure, setTenure] = useState(0)
    const [rate, setRate] = useState(0)

    // string states (for inputs – can be empty)
    const [amountInput, setAmountInput] = useState("")
    const [tenureInput, setTenureInput] = useState("")
    const [rateInput, setRateInput] = useState("")

    const [emi, setEmi] = useState(0)
    const [totalPayment, setTotalPayment] = useState(0)
    const [interestPayable, setInterestPayable] = useState(0)
    const [lineChartData, setLineChartData] = useState<LineChartData[]>([])
    const [hasCalculated, setHasCalculated] = useState(false)

    const calculateLoan = () => {
        // basic guard: don’t calculate if any field is missing/zero
        if (amount <= 0 || tenure <= 0 || rate <= 0) {
            setHasCalculated(false)
            return
        }

        const r = rate / (12 * 100)
        const n = tenure * 12

        const emiValue =
            (amount * r * Math.pow(1 + r, n)) /
            (Math.pow(1 + r, n) - 1)

        setEmi(Math.round(emiValue))

        const totalPaymentValue = emiValue * n
        setTotalPayment(totalPaymentValue)

        const interestPayableValue = totalPaymentValue - amount
        setInterestPayable(interestPayableValue)

        let principalPaid = 0
        let interestPaid = 0
        const chartData: LineChartData[] = []

        for (let i = 1; i <= n; i++) {
            const interestForThisMonth = amount * r
            const principalForThisMonth = emiValue - interestForThisMonth
            principalPaid += principalForThisMonth
            interestPaid += interestForThisMonth

            chartData.push({
                month: i,
                principalPaid,
                interestPaid,
            })
        }

        setLineChartData(chartData)
        setHasCalculated(true)
    }

    const data = useMemo(
        () =>
            hasCalculated
                ? [
                      { name: "Principal amount", value: amount },
                      { name: "Interest amount", value: interestPayable },
                  ]
                : [],
        [hasCalculated, amount, interestPayable]
    )

    // Loan Amount input change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        setAmountInput(raw)

        const numeric = parseInt(raw.replace(/[^0-9]/g, ""), 10)
        if (!isNaN(numeric)) {
            setAmount(numeric)
        } else {
            setAmount(0)
        }
        setHasCalculated(false)
    }

    // Tenure input change
    const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        setTenureInput(raw)

        const numeric = parseInt(raw.replace(/[^0-9]/g, ""), 10)
        if (!isNaN(numeric)) {
            setTenure(numeric)
        } else {
            setTenure(0)
        }
        setHasCalculated(false)
    }

    // Interest Rate input change
    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        setRateInput(raw)

        const numeric = parseFloat(raw.replace(/[^0-9.]/g, ""))
        if (!isNaN(numeric)) {
            setRate(numeric)
        } else {
            setRate(0)
        }
        setHasCalculated(false)
    }

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">
                    Monthly Home Loan EMI Calculator
                </h1>
                <p className="text-muted-foreground mt-4 text-xl">
                    Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:px-12 md:my-16 my-6 p-5 max-w-6xl mx-auto">
                {/* Left Side */}
                <div className="space-y-8">
                    {/* Loan Amount */}
                    <div>
                        <label className="block font-semibold mb-2">Loan Amount</label>
                        <Slider
                            min={100000}
                            max={100000000}
                            step={10000}
                            value={[amount > 0 ? amount : 100000]} // slider has a position, input can stay empty
                            onValueChange={([val]) => {
                                setAmount(val)
                                setAmountInput(val.toString())
                                setHasCalculated(false)
                            }}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>$100k</span>
                            <span>$10M</span>
                        </div>
                        <Input
                            type="text"
                            placeholder="$"
                            value={amountInput}
                            onChange={handleAmountChange}
                            className="mt-2"
                        />
                    </div>

                    {/* Tenure */}
                    <div>
                        <label className="block font-semibold mb-2">Tenure (Years)</label>
                        <Slider
                            min={1}
                            max={30}
                            step={1}
                            value={[tenure > 0 ? tenure : 1]}
                            onValueChange={([val]) => {
                                setTenure(val)
                                setTenureInput(val.toString())
                                setHasCalculated(false)
                            }}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>1</span>
                            <span>30</span>
                        </div>
                        <Input
                            type="text"
                            placeholder="Years"
                            value={tenureInput}
                            onChange={handleTenureChange}
                            className="mt-2 w-24"
                        />
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <label className="block font-semibold mb-2">Interest Rate (% P.A.)</label>
                        <Slider
                            min={0.5}
                            max={15}
                            step={0.1}
                            value={[rate > 0 ? rate : 0.5]}
                            onValueChange={([val]) => {
                                const fixed = parseFloat(val.toFixed(1))
                                setRate(fixed)
                                setRateInput(fixed.toString())
                                setHasCalculated(false)
                            }}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>0.5</span>
                            <span>15</span>
                        </div>
                        <Input
                            type="text"
                            placeholder="% per annum"
                            value={rateInput}
                            onChange={handleRateChange}
                            className="mt-2 w-32"
                        />
                    </div>

                    <Button onClick={calculateLoan} className="w-full mt-4">
                        Calculate
                    </Button>
                </div>

                {/* Right Side */}
                <div className="space-y-6">
                    <div>
                        <p className="text-muted-foreground text-sm">Monthly Home Loan EMI</p>
                        <h2 className="text-3xl font-bold text-primary">
                            {hasCalculated ? `$${emi.toLocaleString()}` : ""}
                        </h2>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Principal Amount</span>
                            <span>{hasCalculated ? `$${amount.toLocaleString()}` : ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Interest Amount</span>
                            <span>{hasCalculated ? `$${interestPayable.toLocaleString()}` : ""}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Total Amount Payable</span>
                            <span>{hasCalculated ? `$${totalPayment.toLocaleString()}` : ""}</span>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-64">
                        {hasCalculated && data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={true}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : null}
                    </div>

                    {/* Line Chart */}
                    <div className="h-64">
                        {hasCalculated && lineChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="principalPaid"
                                        stroke="#0D74FF"
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="interestPaid"
                                        stroke="#FF5733"
                                        activeDot={{ r: 8 }}
                                    />
                                    <ReferenceLine y={0} stroke="#000" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : null}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Page
