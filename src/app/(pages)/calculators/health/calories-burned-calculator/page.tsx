"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

// NEW: shadcn combobox primitives
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

type Activity = {
  id: string;
  name: string;
  met: number; // metabolic equivalent
};

const ACTIVITIES: Activity[] = [
  { id: "chopping-wood", name: "Chopping Wood", met: 6.0 },
  { id: "cleaning-household", name: "Cleaning, Household Tasks", met: 3.5 },
  { id: "felling-trees", name: "Felling Trees", met: 7.0 },
  { id: "gym-exercise", name: "Gym Exercise (general)", met: 5.5 },
  { id: "walking-brisk", name: "Walking (brisk, 4 mph)", met: 5.0 },
  { id: "running-6", name: "Running (6 mph)", met: 9.8 },
  { id: "cycling-12to13", name: "Cycling (12–13.9 mph)", met: 8.0 },
  { id: "yoga", name: "Yoga", met: 2.5 },
  { id: "swimming", name: "Swimming (moderate)", met: 6.0 },
];

interface CaloriesInput {
  exercise: string; // activity name (shown to user)
  met?: number; // chosen activity MET
  duration: number | ""; // minutes
  gender: string;
  age: number | "";
  weight: number | "";
  weightUnit: "kg" | "lb";
}

interface CaloriesResult {
  caloriesBurned: number;
  caloriesPerMinute: number;
  chartData: { time: number; calories: number }[];
}

// Converts lb to kg if needed
const toKg = (weight: number, unit: "kg" | "lb") =>
  unit === "kg" ? weight : weight * 0.45359237;

// MET formula (ACSM):
// kcal = MET * 3.5 * weight(kg) / 200 * duration(min)
const calcByMET = (met: number, duration: number, weightKg: number) =>
  met * 3.5 * weightKg * (duration / 200);

const calculateCaloriesBurned = (input: {
  exercise: string;
  met?: number;
  duration: number;
  gender: string;
  age: number;
  weight: number;
  weightUnit: "kg" | "lb";
}): CaloriesResult => {
  const weightKg = toKg(input.weight, input.weightUnit);

  let baseCalories: number;

  if (input.met && input.met > 0) {
    baseCalories = calcByMET(input.met, input.duration, weightKg);
  } else {
    // Fallback: simple heuristic if no activity chosen
    baseCalories =
      (input.gender === "male" ? 8 : 7) *
      input.duration *
      (weightKg / (input.gender === "male" ? 70 : 60));
  }

  if (input.age < 18) {
    baseCalories *= 1.1;
  }

  const perMin = baseCalories / input.duration;
  const chartData = Array.from({ length: input.duration }, (_v, i) => ({
    time: i + 1,
    calories: perMin * (i + 1),
  }));

  return { caloriesBurned: baseCalories, caloriesPerMinute: perMin, chartData };
};

export default function CaloriesCalculator() {
  const [open, setOpen] = useState(false); // combobox
  const [selected, setSelected] = useState<Activity | null>(null);

  // start everything EMPTY instead of with defaults
  const [input, setInput] = useState<CaloriesInput>({
    exercise: "",
    met: undefined,
    duration: "",
    gender: "male",
    age: "",
    weight: "",
    weightUnit: "kg",
  });

  const [result, setResult] = useState<CaloriesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // allow empty, digits only
    if (!/^\d*$/.test(value)) return;
    setInput((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSelectChange = (name: keyof CaloriesInput, value: any) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // For displaying "Burns XYZ cal/hour" per activity preview
  const caloriesPerHourAt70kg = useMemo(
    () =>
      Object.fromEntries(
        ACTIVITIES.map((a) => [
          a.id,
          Math.round(calcByMET(a.met, 60, 70)), // 70kg reference
        ])
      ),
    []
  );

  const handleCalculate = () => {
    if ((!input.exercise || input.exercise.trim() === "") && !input.met) {
      setError("Please choose an activity.");
      toast.error("Please choose an activity.");
      return;
    }
    if (input.duration === "" || Number(input.duration) <= 0) {
      setError("Please enter a valid duration.");
      toast.error("Please enter a valid duration.");
      return;
    }
    if (input.age === "" || Number(input.age) <= 0) {
      setError("Please enter a valid age.");
      toast.error("Please enter a valid age.");
      return;
    }
    if (input.weight === "" || Number(input.weight) <= 0) {
      setError("Please enter a valid weight.");
      toast.error("Please enter a valid weight.");
      return;
    }

    const durationNum = Number(input.duration);
    const ageNum = Number(input.age);
    const weightNum = Number(input.weight);

    setError(null);
    setResult(
      calculateCaloriesBurned({
        exercise: input.exercise,
        met: input.met,
        duration: durationNum,
        gender: input.gender,
        age: ageNum,
        weight: weightNum,
        weightUnit: input.weightUnit,
      })
    );
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Calories Burned Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Enter details below to calculate the calories burned during an
            activity.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Activity searchable dropdown (combobox) */}
          <div className="space-y-2">
            <Label>Enter an exercise to calculate your calories burned</Label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selected ? selected.name : "Search for exercise or activity"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search activities..." />
                  <CommandList>
                    <CommandEmpty>No activity found.</CommandEmpty>
                    <CommandGroup heading="Activities">
                      {ACTIVITIES.map((act) => (
                        <CommandItem
                          key={act.id}
                          value={act.name}
                          onSelect={() => {
                            setSelected(act);
                            setInput((prev) => ({
                              ...prev,
                              exercise: act.name,
                              met: act.met,
                            }));
                            setOpen(false);
                          }}
                          className="flex items-start justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selected?.id === act.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span>{act.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Burns {caloriesPerHourAt70kg[act.id]} cal/hour
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Input
              className="mt-2"
              placeholder="Or type a custom activity name"
              value={input.exercise}
              onChange={(e) =>
                setInput((p) => ({
                  ...p,
                  exercise: e.target.value,
                  met: p.met,
                }))
              }
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Activity duration</Label>
            <div className="flex items-center gap-3">
              <Input
                name="duration"
                value={input.duration}
                onChange={handleNumber}
                type="number"
                inputMode="numeric"
                placeholder="e.g. 60"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>What is your sex?</Label>
            <Select
              onValueChange={(value) => handleSelectChange("gender", value)}
              defaultValue={input.gender}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label>How old are you?</Label>
            <div className="flex items-center gap-3">
              <Input
                name="age"
                value={input.age}
                onChange={handleNumber}
                type="number"
                inputMode="numeric"
                placeholder="e.g. 21"
              />
              <span className="text-sm text-muted-foreground">years</span>
            </div>
          </div>

          {/* Weight + unit */}
          <div className="space-y-2">
            <Label>How much do you weigh?</Label>
            <div className="flex gap-2">
              <Input
                name="weight"
                value={input.weight}
                onChange={handleNumber}
                type="number"
                inputMode="numeric"
                placeholder="e.g. 60"
              />
              <Select
                onValueChange={(value: "kg" | "lb") =>
                  handleSelectChange("weightUnit", value)
                }
                defaultValue={input.weightUnit}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="kg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full p-5" onClick={handleCalculate}>
            Calculate your calories burned
          </Button>
        </div>

        {/* Error */}
        {error && <div className="mt-4 text-red-500">{error}</div>}

        {/* Results */}
        <div className="mt-6">
          {result && (
            <>
              <h3 className="text-xl">
                Calories burned: {result.caloriesBurned.toFixed(2)} kcal
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Calories Burned", value: result.caloriesBurned },
                      {
                        name: "Remaining Calories",
                        value: Math.max(0, 1000 - result.caloriesBurned),
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#3498db" />
                    <Cell fill="#e74c3c" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#3498db"
                    name="Calories Burned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
