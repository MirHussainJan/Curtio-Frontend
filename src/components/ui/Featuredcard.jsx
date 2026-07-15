import { SlidersHorizontal } from "lucide-react";

export default function FeatureCard({ feature }) {
    const Icon = feature.icon;

    return (
        <article
            className={`grid items-center gap-14 lg:grid-cols-2 ${feature.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
        >
            {/* LEFT */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

                {feature.highlight && (
                    <div className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>

                        The whole point
                    </div>
                )}

                {/* Browser */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">

                    <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-3">

                        <span className="h-3 w-3 rounded-full bg-red-400"></span>

                        <span className="h-3 w-3 rounded-full bg-yellow-400"></span>

                        <span className="h-3 w-3 rounded-full bg-green-400"></span>

                        <div className="ml-auto text-xs font-medium text-slate-500">
                            {feature.browserUrl}
                        </div>

                    </div>

                    <div className="flex h-72 items-center justify-center bg-gradient-to-br from-slate-50 to-white p-8">

                        {feature.visualType === "analytics" ? (
                            <div className="w-full space-y-4">

                                <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">

                                    <div className="flex items-center gap-2">

                                        <span className="h-3 w-3 rounded-full bg-slate-300"></span>

                                        Bots & previews

                                    </div>

                                    <span>4 clicks</span>

                                </div>

                                <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">

                                    <div className="flex items-center gap-2">

                                        <span className="h-3 w-3 rounded-full bg-slate-300"></span>

                                        Counted by others

                                    </div>

                                    <span>4</span>

                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">

                                    <div className="flex items-center gap-2">

                                        <span className="h-3 w-3 rounded-full bg-indigo-600"></span>

                                        Counted by curtio

                                    </div>

                                    <span className="font-semibold text-indigo-600">
                                        1
                                    </span>

                                </div>

                            </div>
                        ) : (
                            <div className="flex flex-col items-center">

                                <div
                                    className={`flex h-28 w-28 items-center justify-center rounded-3xl ${feature.color === "orange"
                                            ? "bg-orange-100 text-orange-500"
                                            : "bg-indigo-100 text-indigo-600"
                                        }`}
                                >
                                    <Icon size={60} strokeWidth={1.8} />
                                </div>

                                <p className="mt-8 text-center text-sm text-slate-500">
                                    {feature.caption}
                                </p>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div>

                <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color === "orange"
                            ? "bg-orange-500"
                            : "bg-indigo-600"
                        } text-white`}
                >
                    <Icon size={28} />
                </div>

                <h2 className="mt-7 text-4xl font-bold tracking-tight text-slate-900">
                    {feature.title}
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                    {feature.description}
                </p>

                <div className="mt-8 flex items-start gap-4 rounded-2xl bg-slate-100 p-5">

                    <SlidersHorizontal
                        className="mt-1 text-indigo-600"
                        size={22}
                    />

                    <p className="text-slate-700 leading-7">

                        <span className="font-semibold">
                            You control:
                        </span>{" "}

                        {feature.control}

                    </p>

                </div>

            </div>
        </article>
    );
}