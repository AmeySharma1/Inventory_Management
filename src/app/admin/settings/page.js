"use client";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">System configuration and preferences</p>
      </div>

      {[
        {
          title: "Unit Conversion Factors",
          desc: "Base conversion rates used across the system",
          items: [
            { label: "1 kg =", value: "1,000 g" },
            { label: "1 L =", value: "1,000 mL" },
            { label: "Base weight unit", value: "grams (g)" },
            { label: "Base volume unit", value: "millilitres (mL)" },
          ],
        },
        {
          title: "Currency & Pricing",
          items: [
            { label: "Default currency", value: "INR (₹)" },
            { label: "Price precision", value: "Up to 10 decimal places" },
            { label: "Display rounding", value: "2 decimal places" },
          ],
        },
        {
          title: "Database",
          items: [
            { label: "Provider", value: "Neon PostgreSQL" },
            { label: "Price storage type", value: "NUMERIC(20,10)" },
            { label: "Quantity storage type", value: "NUMERIC(20,10)" },
          ],
        },
      ].map((section) => (
        <div key={section.title} className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/8">
            <h3 className="text-sm font-semibold text-white">{section.title}</h3>
            {section.desc && <p className="text-xs text-white/40 mt-0.5">{section.desc}</p>}
          </div>
          <div className="p-4 space-y-3">
            {section.items.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/50">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
