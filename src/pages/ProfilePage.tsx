import { useState } from "react"

type Profile = {
  name: string
  age: string
  gender: string
  state: string
  district: string
  occupation: string
  education: string
  employmentStatus: string
  studentStatus: string
  income: string
  socialCategory: string
  maritalStatus: string
  disabilityStatus: string
  residence: string
  landStatus: string
  businessStatus: string
  businessType: string
}

const initialProfile: Profile = {
  name: "",
  age: "",
  gender: "",
  state: "",
  district: "",
  occupation: "",
  education: "",
  employmentStatus: "",
  studentStatus: "",
  income: "",
  socialCategory: "",
  maritalStatus: "",
  disabilityStatus: "",
  residence: "",
  landStatus: "",
  businessStatus: "",
  businessType: "",
}

const occupations = [
  "Student",
  "Farmer",
  "Agricultural Worker",
  "Government Employee",
  "Private Employee",
  "Self-Employed",
  "Business Owner",
  "Entrepreneur",
  "Daily Wage / Labour Worker",
  "Construction Worker",
  "Artisan / Craftsman",
  "Fisherman / Fisherwoman",
  "Weaver",
  "Unemployed",
  "Homemaker",
  "Retired / Senior Citizen",
  "Other",
]

const states = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Jammu and Kashmir",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other / All India",
]

const isAgricultureRelated = (occupation: string) =>
  ["Farmer", "Agricultural Worker"].includes(occupation)

const isBusinessRelated = (occupation: string) =>
  ["Self-Employed", "Business Owner", "Entrepreneur"].includes(occupation)

const Field = ({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-[#102a43]">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
  </label>
)

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#102a43] outline-none transition placeholder:text-slate-400 focus:border-[#0b63b6] focus:ring-4 focus:ring-[#0b63b6]/10"

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile)

  const update = (field: keyof Profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("GovAssist profile:", profile)
    alert("Profile saved. The recommendation engine will use these details to find potentially relevant schemes.")
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102a43]">
      <div className="bg-[#073b6f] text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-2 text-xs sm:px-10 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">भारत</span>
            <span className="opacity-50">|</span>
            <span>Government Scheme Information</span>
          </div>
          <span className="hidden sm:block opacity-90">GovAssist</span>
        </div>
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-10">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#073b6f]">
              Gov<span className="text-[#0f8a5f]">Assist</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 sm:text-xs">
              Government Scheme Recommendation & AI Assistant
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-[#073b6f] hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1050px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3fb] text-xl font-extrabold text-[#073b6f]">
            01
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#102a43] sm:text-4xl">
            Create Your Profile
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Tell us a little about yourself. Your information will help
            GovAssist identify schemes that may be relevant to your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
                Section 01
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#102a43]">
                Basic Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Basic information used to understand your profile.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  required
                  value={profile.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </Field>

              <Field label="Age" required>
                <input
                  required
                  min="1"
                  max="120"
                  type="number"
                  value={profile.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="Enter your age"
                  className={inputClass}
                />
              </Field>

              <Field label="Gender">
                <select
                  value={profile.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Transgender</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>

              <Field label="State" required>
                <select
                  required
                  value={profile.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </Field>

              <Field label="District">
                <input
                  value={profile.district}
                  onChange={(e) => update("district", e.target.value)}
                  placeholder="Enter your district"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
                Section 02
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#102a43]">
                Occupation & Education
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose the option that best describes your current situation.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Occupation / Beneficiary Type" required>
                <select
                  required
                  value={profile.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select occupation</option>
                  {occupations.map((occupation) => (
                    <option key={occupation}>{occupation}</option>
                  ))}
                </select>
              </Field>

              <Field label="Education Level">
                <select
                  value={profile.education}
                  onChange={(e) => update("education", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select education level</option>
                  <option>School</option>
                  <option>Higher Secondary</option>
                  <option>Diploma</option>
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Doctorate</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>

              <Field label="Employment Status">
                <select
                  value={profile.employmentStatus}
                  onChange={(e) => update("employmentStatus", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select employment status</option>
                  <option>Employed</option>
                  <option>Self-Employed</option>
                  <option>Unemployed</option>
                  <option>Retired</option>
                  <option>Student</option>
                  <option>Homemaker</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Are you currently a student?">
                <select
                  value={profile.studentStatus}
                  onChange={(e) => update("studentStatus", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
                Section 03
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#102a43]">
                Financial & Social Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                These details can help identify schemes with corresponding
                eligibility conditions.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Annual Family Income">
                <select
                  value={profile.income}
                  onChange={(e) => update("income", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select income range</option>
                  <option>Below ₹1 Lakh</option>
                  <option>₹1 Lakh – ₹2.5 Lakh</option>
                  <option>₹2.5 Lakh – ₹5 Lakh</option>
                  <option>₹5 Lakh – ₹10 Lakh</option>
                  <option>Above ₹10 Lakh</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>

              <Field label="Social Category">
                <select
                  value={profile.socialCategory}
                  onChange={(e) => update("socialCategory", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>

              <Field label="Marital Status">
                <select
                  value={profile.maritalStatus}
                  onChange={(e) => update("maritalStatus", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select marital status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Divorced / Separated</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>

              <Field label="Disability Status">
                <select
                  value={profile.disabilityStatus}
                  onChange={(e) => update("disabilityStatus", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>No</option>
                  <option>Yes</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>

              <Field label="Residence">
                <select
                  value={profile.residence}
                  onChange={(e) => update("residence", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select residence type</option>
                  <option>Rural</option>
                  <option>Urban</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>
            </div>
          </section>

          {(isAgricultureRelated(profile.occupation) ||
            isBusinessRelated(profile.occupation)) && (
            <section className="rounded-2xl border border-[#cfe0ef] bg-[#f5faff] p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
                  Section 04
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-[#102a43]">
                  Additional Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  These questions appear based on the occupation you selected.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {isAgricultureRelated(profile.occupation) && (
                  <Field label="Land / Agricultural Status">
                    <select
                      value={profile.landStatus}
                      onChange={(e) => update("landStatus", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select status</option>
                      <option>Own agricultural land</option>
                      <option>Lease agricultural land</option>
                      <option>No agricultural land</option>
                      <option>Prefer not to say</option>
                    </select>
                  </Field>
                )}

                {isBusinessRelated(profile.occupation) && (
                  <>
                    <Field label="Business Status">
                      <select
                        value={profile.businessStatus}
                        onChange={(e) =>
                          update("businessStatus", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">Select status</option>
                        <option>Existing business</option>
                        <option>Starting a business</option>
                        <option>Expanding a business</option>
                        <option>Prefer not to say</option>
                      </select>
                    </Field>

                    <Field label="Business / Enterprise Type">
                      <input
                        value={profile.businessType}
                        onChange={(e) =>
                          update("businessType", e.target.value)
                        }
                        placeholder="e.g. Retail, Manufacturing, Services"
                        className={inputClass}
                      />
                    </Field>
                  </>
                )}
              </div>
            </section>
          )}

          <div className="rounded-2xl border border-[#ead7a0] bg-[#fff8df] p-5">
            <div className="flex gap-3">
              <span className="text-lg">ⓘ</span>
              <div>
                <p className="text-sm font-extrabold text-[#6b5410]">
                  How your profile is used
                </p>
                <p className="mt-1 text-xs leading-5 text-[#705f28] sm:text-sm">
                  Your answers help identify schemes that may be relevant to
                  your profile. They do not guarantee eligibility. Always
                  verify the complete eligibility requirements with the
                  concerned official scheme or department.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#073b6f] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#073b6f]/15 transition hover:-translate-y-0.5 hover:bg-[#062f59] sm:w-auto"
            >
              Find Potentially Relevant Schemes →
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ProfilePage
