import { Check, X } from "lucide-react";

const comparisonData = [
  {
    feature: "Click counts",
    other: "Padded by bots and previews",
    curtio: "Counted once, real visitors only",
  },
  {
    feature: "Analytics on the free tier",
    other: "Limited or behind a paywall",
    curtio: "Full analytics on your free link",
  },
  {
    feature: "Credit card to start",
    other: "Often required",
    curtio: "Never",
  },
  {
    feature: "The redirect",
    other: "Sometimes shows an ad first",
    curtio: "Straight to the destination, fast",
  },
  {
    feature: "The feel",
    other: "Built like it is still 2015",
    curtio: "Clean, modern, made for you",
  },
];

const ComparisonSection = () => {
  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 leading-tight">
            A Bitly and Cuttly alternative built on honest numbers
          </h2>

          <p className="mt-5 text-lg md:text-xl text-slate-500 leading-8">
            People come to curtio after they stop trusting their old
            shortener. Here is what changes when you switch.
          </p>
        </div>

        {/* Table wrapper with overflow-x-auto to make it fully responsive on mobile */}
        <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-lg">
          <div className="min-w-[620px] divide-y divide-slate-200">
            {/* Header */}
            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="p-6"></div>

              <div className="border-l border-slate-200 p-6 text-center font-semibold text-slate-500">
                The usual shorteners
              </div>

              <div className="border-l border-indigo-200 bg-indigo-50 p-6 font-bold text-indigo-700">
                curtio.
              </div>
            </div>

            {comparisonData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.2fr_1fr_1fr]"
              >
                <div className="p-6 font-semibold text-slate-900 flex items-center">
                  {item.feature}
                </div>

                <div className="flex items-center gap-3 border-l border-slate-200 p-6 text-slate-500">
                  <X
                    size={18}
                    strokeWidth={2.2}
                    className="text-slate-400 flex-shrink-0"
                  />
                  <span>{item.other}</span>
                </div>

                <div className="flex items-center gap-3 border-l border-indigo-200 bg-indigo-50 p-6 text-slate-900">
                  <Check
                    size={18}
                    strokeWidth={2.5}
                    className="text-indigo-600 flex-shrink-0"
                  />
                  <span>{item.curtio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;