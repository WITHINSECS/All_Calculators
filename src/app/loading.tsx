import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="flex flex-col items-center gap-4 text-center">
                    <Spinner className="h-8 w-8 text-slate-900" />
                <div className="space-y-1">
                    <p className="text-base font-semibold text-slate-900">Loading</p>
                </div>
            </div>
        </div>
    );
}
