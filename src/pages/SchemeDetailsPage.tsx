import { useState } from "react"

type SchemeDetailsPageProps = {
  schemeName: string
}

const SchemeDetailsPage = ({
  schemeName,
}: SchemeDetailsPageProps) => {
  const [activeTab, setActiveTab] = useState("Overview")

  const tabs = [
    "Overview",
    "Eligibility",
    "Benefits",
    "Documents",
    "How to Apply",
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Top utility bar */}
      <div className="bg-[#071d35] px-6 py-2 text-center text-xs text-white/80">
        Government Scheme Recommendation & AI Assistant
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#073b6f] text-lg font-bold text-white">
              G
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#073b6f]">
                GovAssist
              </h1>

              <p className="text-xs text-slate-500">
                Government Scheme Recommendation & AI Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Schemes
          </button>
        </div>
      </header>

      {/* Scheme Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eaf7f2] px-3 py-1 text-xs font-semibold text-[#07845b]">
                Demo Scheme
              </span>

              <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#073b6f]">
                Government Scheme
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#073b6f] md:text-4xl">
              {schemeName || "Education Support Scheme (Demo)"}
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Explore the available information about this scheme in a simple
              and structured format.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Details */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="overflow-x-auto border-b border-slate-200">
              <div className="flex min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-4 text-sm font-semibold transition ${
                      activeTab === tab
                        ? "border-b-2 border-[#073b6f] text-[#073b6f]"
                        : "text-slate-500 hover:text-[#073b6f]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* Overview */}
              {activeTab === "Overview" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    Scheme Overview
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    This section will contain the detailed description of the
                    selected government scheme. During the backend integration
                    stage, this information will be retrieved from the
                    GovAssist scheme dataset.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <InfoBox
                      label="Scheme Name"
                      value={schemeName || "Demo Scheme"}
                    />

                    <InfoBox
                      label="Scheme Category"
                      value="To be connected"
                    />

                    <InfoBox
                      label="Scheme Level"
                      value="To be connected"
                    />

                    <InfoBox
                      label="Information Source"
                      value="GovAssist Dataset"
                    />
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {activeTab === "Eligibility" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    Eligibility
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    Eligibility information will be displayed here using the
                    eligibility information available in the scheme dataset.
                  </p>

                  <div className="mt-6 rounded-xl bg-[#f7f9fc] p-5">
                    <p className="text-sm font-semibold text-slate-700">
                      Eligibility Information
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Detailed eligibility information will be connected when
                      the real scheme dataset is integrated.
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-[#ead89a] bg-[#fff9df] p-5">
                    <p className="text-sm font-semibold text-slate-800">
                      Important
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Showing a scheme does not mean that the user is
                      officially eligible. Eligibility should always be
                      verified using the relevant official information.
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {activeTab === "Benefits" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    Benefits
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Benefits available under the selected scheme will be
                    displayed here from the connected scheme data.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      "Scheme-related assistance",
                      "Support for eligible beneficiaries",
                      "Benefits based on applicable scheme conditions",
                    ].map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                      >
                        <span className="mt-0.5 font-bold text-[#07845b]">
                          ✓
                        </span>

                        <p className="text-sm leading-6 text-slate-600">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {activeTab === "Documents" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    Required Documents
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    The required documents will be displayed here based on the
                    information available in the connected scheme dataset.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      "Identity document — placeholder",
                      "Supporting documents — based on scheme requirements",
                      "Additional documents where applicable",
                    ].map((document) => (
                      <div
                        key={document}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-sm text-slate-600">
                          📄 {document}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How to Apply */}
              {activeTab === "How to Apply" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    How to Apply
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Application instructions will be retrieved from the scheme
                    data during the backend integration stage.
                  </p>

                  <div className="mt-6 space-y-5">
                    {[
                      "Review the available scheme information.",
                      "Check the eligibility information provided by the relevant authority.",
                      "Prepare the required documents.",
                      "Follow the official application process.",
                    ].map((step, index) => (
                      <div key={step} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#073b6f] text-sm font-bold text-white">
                          {index + 1}
                        </div>

                        <p className="pt-1 text-sm leading-6 text-slate-600">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-5">
            {/* Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#073b6f]">
                Scheme Summary
              </h3>

              <div className="mt-5 space-y-4">
                <SummaryRow
                  label="Scheme"
                  value={schemeName || "Demo Scheme"}
                />

                <SummaryRow
                  label="Category"
                  value="To be connected"
                />

                <SummaryRow
                  label="Level"
                  value="To be connected"
                />

                <SummaryRow
                  label="Status"
                  value="Demo Preview"
                />
              </div>

              <button
                onClick={() =>
                  alert(
                    "Official application information will be connected during the backend integration stage."
                  )
                }
                className="mt-6 w-full rounded-xl bg-[#073b6f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]"
              >
                Application Information →
              </button>
            </div>

            {/* Important Information */}
            <div className="rounded-2xl border border-[#ead89a] bg-[#fff9df] p-6">
              <h3 className="font-bold text-slate-800">
                Important Information
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                GovAssist is designed to help users discover and understand
                scheme information. It does not guarantee eligibility or
                represent an official government website.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Demo Disclaimer */}
      <section className="border-t border-[#ead89a] bg-[#fff9df]">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-center text-xs leading-5 text-slate-700">
            <strong>Demo notice:</strong> This page currently contains sample
            frontend content. Real scheme information will be connected from
            the GovAssist dataset during the backend integration stage.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#073b6f] px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="font-bold">GovAssist</p>

            <p className="mt-1 text-xs text-white/70">
              Government Scheme Recommendation & AI Assistant
            </p>
          </div>

          <p className="text-xs text-white/70">
            Student project • Not an official government website
          </p>
        </div>
      </footer>
    </div>
  )
}

/* Reusable information box */
const InfoBox = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  )
}

/* Reusable sidebar row */
const SummaryRow = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="max-w-[170px] text-right text-sm font-semibold text-slate-700">
        {value}
      </span>
    </div>
  )
}

export default SchemeDetailsPage