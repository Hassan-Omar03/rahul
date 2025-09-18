import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown,Shield,Lock,Globe2,ShieldCheck } from "lucide-react";
import logo from "../Assests/newlogo.png";
import mobile from "../Assests/new.jpeg";
import selected from "../Assests/selected.png";
import nonselected from "../Assests/nonselected.png";
import header from "../Assests/HEADER.png";
/* -----------------------
   Types & Constants
   ----------------------- */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

type CountryKey =
  | "Australia"
  | "Austria"
  | "Belgium"
  | "Canada"
  | "Cyprus"
  | "Czech Republic"
  | "Denmark"
  | "Estonia"
  | "Finland"
  | "France"
  | "Germany"
  | "Ireland"
  | "Israel"
  | "Italy"
  | "Japan"
  | "Luxembourg"
  | "Malta"
  | "Mauritius"
  | "Netherlands"
  | "New Zealand"
  | "Norway"
  | "Portugal"
  | "Qatar"
  | "Reunion Island"
  | "Saudi Arabia"
  | "Singapore"
  | "Slovenia"
  | "South Africa"
  | "South Korea"
  | "Spain"
  | "Sweden"
  | "Switzerland"
  | "United Arab Emirates"
  | "United States"
  | "United Kingdom"
  | "Other Countries"
  | "";

type ConversionOp = "divide" | "multiply";

interface CountryRule {
  multiplier: number;
  currency: string;
  op: ConversionOp;
  rate: number;
}

interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const COUNTRY_RULES: Record<Exclude<CountryKey, "">, CountryRule> = {
  Australia: { multiplier: 2.3, currency: "AUD", op: "divide", rate: 29 },
  Austria: { multiplier: 2.1, currency: "EUR", op: "divide", rate: 48 },
  Belgium: { multiplier: 2.2, currency: "EUR", op: "divide", rate: 48 },
  Canada: { multiplier: 2.4, currency: "CAD", op: "divide", rate: 34 },
  Cyprus: { multiplier: 2.0, currency: "EUR", op: "divide", rate: 48 },
  "Czech Republic": { multiplier: 1.8, currency: "EUR", op: "divide", rate: 48 },
  Denmark: { multiplier: 2.3, currency: "EUR", op: "divide", rate: 48 },
  Estonia: { multiplier: 2.0, currency: "EUR", op: "divide", rate: 48 },
  Finland: { multiplier: 2.2, currency: "EUR", op: "divide", rate: 48 },
  France: { multiplier: 2.2, currency: "EUR", op: "divide", rate: 48 },
  Germany: { multiplier: 2.2, currency: "EUR", op: "divide", rate: 48 },
  Ireland: { multiplier: 2.2, currency: "EUR", op: "divide", rate: 48 },
  Israel: { multiplier: 2.3, currency: "ILS", op: "divide", rate: 13 },
  Italy: { multiplier: 2.0, currency: "EUR", op: "divide", rate: 48 },
  Japan: { multiplier: 2.0, currency: "JPY", op: "multiply", rate: 3.1 },
  Luxembourg: { multiplier: 2.5, currency: "EUR", op: "divide", rate: 48 },
  Malta: { multiplier: 2.0, currency: "EUR", op: "divide", rate: 48 },
  Mauritius: { multiplier: 1.0, currency: "MUR", op: "multiply", rate: 1 },
  Netherlands: { multiplier: 2.3, currency: "EUR", op: "divide", rate: 48 },
  "New Zealand": { multiplier: 2.2, currency: "NZD", op: "divide", rate: 28 },
  Norway: { multiplier: 2.4, currency: "EUR", op: "divide", rate: 48 },
  Portugal: { multiplier: 1.8, currency: "EUR", op: "divide", rate: 48 },
  Qatar: { multiplier: 2.0, currency: "QAR", op: "divide", rate: 12 },
  "Reunion Island": { multiplier: 2.2, currency: "EUR", op: "divide", rate: 48 },
  "Saudi Arabia": { multiplier: 2.0, currency: "SAR", op: "divide", rate: 12 },
  Singapore: { multiplier: 2.2, currency: "SGD", op: "divide", rate: 33 },
  Slovenia: { multiplier: 1.9, currency: "EUR", op: "divide", rate: 48 },
  "South Africa": { multiplier: 1.5, currency: "ZAR", op: "divide", rate: 2.7 },
  "South Korea": { multiplier: 2.0, currency: "KRW", op: "multiply", rate: 28 },
  Spain: { multiplier: 1.9, currency: "EUR", op: "divide", rate: 48 },
  Sweden: { multiplier: 2.3, currency: "EUR", op: "divide", rate: 48 },
  Switzerland: { multiplier: 2.8, currency: "CHF", op: "divide", rate: 53 },
  "United Arab Emirates": { multiplier: 2.0, currency: "AED", op: "divide", rate: 12 },
  "United States": { multiplier: 2.5, currency: "USD", op: "divide", rate: 46 },
  "United Kingdom": { multiplier: 2.5, currency: "GBP", op: "divide", rate: 58 },
  "Other Countries": { multiplier: 2.0, currency: "EUR", op: "divide", rate: 48 },
};

const COUNTRY_OPTIONS: CountryKey[] = [
  "Australia",
  "Austria",
  "Belgium",
  "Canada",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Luxembourg",
  "Malta",
  "Mauritius",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Portugal",
  "Qatar",
  "Reunion Island",
  "Saudi Arabia",
  "Singapore",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Other Countries",
];

type FeatureKey =
  | "contact-form"
  | "whatsapp-chat"
  | "messenger-chat"
  | "blog"
  | "payment-gateway"
  | "multi-language"
  | "booking"
  | "gallery"
  | "newsletter";

interface FormData {
  fullName: string;
  companyName: string;
  country: CountryKey;
  websiteType: "landing" | "corporate" | "ecommerce" | "";
  products: "1-10" | "11-50" | "51-200" | "200-500" | "";
  insertProducts: "insert-all" | "provide-training" | "";
  pages: "1-3" | "4-7" | "8-15" | "15+" | "";
  designStyle: "template" | "semi-custom" | "fully-custom" | "not-sure" | "";
  features: FeatureKey[];
  timeline: "6-8-weeks" | "3-5-weeks" | "2-4-weeks" | "<2-weeks" | "";
  hosting: "bim africa to provide" | "client" | "";
  domain: "bim africa to provide" | "client" | "";
  whatsappNumber: string;
  email: string;
  comments: string;
}

interface PricingData {
  basePrice: number;
  productsPrice: number;
  insertProductsPrice: number;
  pagesPrice: number;
  designPrice: number;
  featuresPrice: number;
  timelinePrice: number;
  hostingPrice: number;
  domainPrice: number;
  totalPrice: number;
}

interface ConvertedPrice {
  amount: number;
  currency: string;
}

// GA helpers
const initGoogleAnalytics = (): void => {
  try {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-M6FWN2GGV0";
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-M6FWN2GGV0");
  } catch (error) {
    console.error("Error initializing Google Analytics:", error);
  }
};

const trackEvent = (
  action: string,
  category: string = "QuotationTool",
  label: string = "",
  value: number = 0
): void => {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

/* -----------------------
   Phone Input Component
   - uses REST API but has a full fallback list covering COUNTRY_OPTIONS
   ----------------------- */

interface PhoneInputProps {
  value: string;
  onChange: (value: string, selectedCountry: CountryData) => void;
  selectedCountry: string; // iso2 code (lowercase) expected
  disabled?: boolean;
  placeholder?: string;
  onCountryChange?: (countryNameOrData: string | CountryData) => void; // can pass string or full CountryData
}

const PhoneInputComponent: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  selectedCountry,
  disabled = false,
  placeholder = "Enter phone number",
  onCountryChange,
}) => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // full fallback list aligned with COUNTRY_OPTIONS (iso code, dial code, flag emoji)
  const FALLBACK_COUNTRIES: CountryData[] = [
    { name: "Australia", code: "au", dialCode: "+61", flag: "🇦🇺" },
    { name: "Austria", code: "at", dialCode: "+43", flag: "🇦🇹" },
    { name: "Belgium", code: "be", dialCode: "+32", flag: "🇧🇪" },
    { name: "Canada", code: "ca", dialCode: "+1", flag: "🇨🇦" },
    { name: "Cyprus", code: "cy", dialCode: "+357", flag: "🇨🇾" },
    { name: "Czech Republic", code: "cz", dialCode: "+420", flag: "🇨🇿" },
    { name: "Denmark", code: "dk", dialCode: "+45", flag: "🇩🇰" },
    { name: "Estonia", code: "ee", dialCode: "+372", flag: "🇪🇪" },
    { name: "Finland", code: "fi", dialCode: "+358", flag: "🇫🇮" },
    { name: "France", code: "fr", dialCode: "+33", flag: "🇫🇷" },
    { name: "Germany", code: "de", dialCode: "+49", flag: "🇩🇪" },
    { name: "Ireland", code: "ie", dialCode: "+353", flag: "🇮🇪" },
    { name: "Israel", code: "il", dialCode: "+972", flag: "🇮🇱" },
    { name: "Italy", code: "it", dialCode: "+39", flag: "🇮🇹" },
    { name: "Japan", code: "jp", dialCode: "+81", flag: "🇯🇵" },
    { name: "Luxembourg", code: "lu", dialCode: "+352", flag: "🇱🇺" },
    { name: "Malta", code: "mt", dialCode: "+356", flag: "🇲🇹" },
    { name: "Mauritius", code: "mu", dialCode: "+230", flag: "🇲🇺" },
    { name: "Netherlands", code: "nl", dialCode: "+31", flag: "🇳🇱" },
    { name: "New Zealand", code: "nz", dialCode: "+64", flag: "🇳🇿" },
    { name: "Norway", code: "no", dialCode: "+47", flag: "🇳🇴" },
    { name: "Portugal", code: "pt", dialCode: "+351", flag: "🇵🇹" },
    { name: "Qatar", code: "qa", dialCode: "+974", flag: "🇶🇦" },
    { name: "Reunion Island", code: "re", dialCode: "+262", flag: "🇷🇪" },
    { name: "Saudi Arabia", code: "sa", dialCode: "+966", flag: "🇸🇦" },
    { name: "Singapore", code: "sg", dialCode: "+65", flag: "🇸🇬" },
    { name: "Slovenia", code: "si", dialCode: "+386", flag: "🇸🇮" },
    { name: "South Africa", code: "za", dialCode: "+27", flag: "🇿🇦" },
    { name: "South Korea", code: "kr", dialCode: "+82", flag: "🇰🇷" },
    { name: "Spain", code: "es", dialCode: "+34", flag: "🇪🇸" },
    { name: "Sweden", code: "se", dialCode: "+46", flag: "🇸🇪" },
    { name: "Switzerland", code: "ch", dialCode: "+41", flag: "🇨🇭" },
    { name: "United Arab Emirates", code: "ae", dialCode: "+971", flag: "🇦🇪" },
    { name: "United States", code: "us", dialCode: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "gb", dialCode: "+44", flag: "🇬🇧" },
    { name: "Other Countries", code: "oc", dialCode: "+000", flag: "🌐" },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag");
        const data = await res.json();

        const formatted: CountryData[] = (data || [])
          .filter((c: any) => c?.idd?.root && Array.isArray(c.idd.suffixes) && c.idd.suffixes.length > 0)
          .map((c: any) => ({
            name: c.name?.common || String(c.name),
            code: (c.cca2 || "").toLowerCase(),
            dialCode: `${c.idd.root}${c.idd.suffixes[0]}`,
            flag: c.flag || "",
          }))
          .sort((a: CountryData, b: CountryData) => a.name.localeCompare(b.name));

        // Merge or fallback: include all fallback countries to guarantee all your options exist
        const merged = [...formatted];

        // ensure fallback entries exist (avoid duplicates by code)
        FALLBACK_COUNTRIES.forEach((fb) => {
          if (!merged.find((m) => m.code === fb.code)) merged.push(fb);
        });

        // keep unique by code
        const uniqueByCode = Array.from(
          new Map(merged.map((c) => [c.code, c])).values()
        );

        setCountries(uniqueByCode.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error("Failed to fetch countries, using fallback:", err);
        setCountries(FALLBACK_COUNTRIES.slice().sort((a, b) => a.name.localeCompare(b.name)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // current country based on selectedCountry iso, fallback to Mauritius or first list item
  const currentCountryData =
    countries.find((c) => c.code === selectedCountry) ||
    countries.find((c) => c.code === "mu") ||
    countries[0] ||
    { name: "Unknown", code: "mu", dialCode: "+230", flag: "🇲🇺" };
    

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dialCode.includes(searchTerm)
  );

  // utilities
  const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");
  const MAX_DIGITS = 17;
  const MIN_DIGITS = 9;

  // user typed in the phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phone = e.target.value;

    // allow +, digits and spaces only
    phone = phone.replace(/[^\d+\s]/g, "");

    // count digits user typed (local input)
    let typedDigits = onlyDigits(phone);

    // if starts with + - it may include a full dial; attempt to find best match among known dial codes
    if (phone.startsWith("+")) {
      // build potential full number as typed; attempt to match country dial
      const sorted = countries.slice().sort((a, b) => b.dialCode.length - a.dialCode.length);
      const match = sorted.find((c) => phone.startsWith(c.dialCode));
      // Enforce MAX_DIGITS on the whole typed string (including dial)
      // compute current total digits in phone (includes dial + rest)
      let totalDigits = onlyDigits(phone).length;
      if (totalDigits > MAX_DIGITS) {
        // truncate the digits part to MAX_DIGITS while preserving leading + and possible non-digits
        let kept = 0;
        const truncatedChars: string[] = [];
        for (const ch of phone.split("")) {
          if (/\d/.test(ch)) {
            if (kept < MAX_DIGITS) {
              truncatedChars.push(ch);
              kept++;
            } else {
              // skip
            }
          } else {
            truncatedChars.push(ch);
          }
        }
        phone = truncatedChars.join("").replace(/\s{2,}/g, " ").trim();
      }

      if (match) {
        onChange(phone, match);
        if (onCountryChange) onCountryChange(match);
        return;
      }
      // no match — update using currentCountryData as selected
      onChange(phone, currentCountryData);
      if (onCountryChange) onCountryChange(currentCountryData);
      return;
    }

    // Local number entered — we must ensure total digits (dial + local) <= MAX_DIGITS
    const dialDigits = onlyDigits(currentCountryData.dialCode).length;
    const allowedLocalDigits = Math.max(0, MAX_DIGITS - dialDigits);

    if (typedDigits.length > allowedLocalDigits) {
      // truncate local part to allowedLocalDigits
      // rebuild phone keeping only allowed number of digits and spaces/+ (though local has no +)
      let kept = 0;
      const truncatedChars: string[] = [];
      for (const ch of phone.split("")) {
        if (/\d/.test(ch)) {
          if (kept < allowedLocalDigits) {
            truncatedChars.push(ch);
            kept++;
          } else {
            // skip
          }
        } else {
          // keep spaces if any
          truncatedChars.push(ch);
        }
      }
      phone = truncatedChars.join("").replace(/\s{2,}/g, " ").trim();
      typedDigits = onlyDigits(phone);
    }

    // local digits: prefix with current country dial code
    const local = phone.replace(/[^\d\s]/g, "").trim();
    const newNumber = currentCountryData.dialCode + (local ? " " + local : " ");
    onChange(newNumber, currentCountryData);
    if (onCountryChange) onCountryChange(currentCountryData);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("Text") || "").replace(/[^\d+]/g, "");
    if (!pasted) return;

    // If pasted starts with +, we'll attempt to use as-is and enforce MAX_DIGITS
    if (pasted.startsWith("+")) {
      let digits = onlyDigits(pasted);
      if (digits.length > MAX_DIGITS) {
        // truncate digits to MAX_DIGITS while preserving leading +
        let kept = 0;
        const truncatedChars: string[] = [];
        for (const ch of pasted.split("")) {
          if (/\d/.test(ch)) {
            if (kept < MAX_DIGITS) {
              truncatedChars.push(ch);
              kept++;
            } else {
              // skip
            }
          } else {
            truncatedChars.push(ch);
          }
        }
        const truncated = truncatedChars.join("").replace(/\s{2,}/g, " ").trim();
        // detect dial match
        const sorted = countries.slice().sort((a, b) => b.dialCode.length - a.dialCode.length);
        const match = sorted.find((c) => truncated.startsWith(c.dialCode)) || currentCountryData;
        onChange(truncated, match);
        if (onCountryChange) onCountryChange(match);
        return;
      } else {
        const sorted = countries.slice().sort((a, b) => b.dialCode.length - a.dialCode.length);
        const match = sorted.find((c) => pasted.startsWith(c.dialCode)) || currentCountryData;
        onChange(pasted, match);
        if (onCountryChange) onCountryChange(match);
        return;
      }
    }

    // pasted local number: join with current dial, then enforce MAX_DIGITS
    const dial = currentCountryData.dialCode;
    const dialDigits = onlyDigits(dial).length;
    let localDigits = onlyDigits(pasted);
    // allowed local digits
    const allowedLocal = Math.max(0, MAX_DIGITS - dialDigits);
    if (localDigits.length > allowedLocal) {
      localDigits = localDigits.slice(0, allowedLocal);
    }
    const newNumber = dial + (localDigits ? " " + localDigits : " ");
    onChange(newNumber, currentCountryData);
    if (onCountryChange) onCountryChange(currentCountryData);
  };

  const handleCountrySelect = (c: CountryData) => {
    // keep the number-part (strip current country dial from the value)
    const currentDialEscaped = currentCountryData.dialCode.replace("+", "\\+");
    const numberPart = value.replace(new RegExp("^" + currentDialEscaped), "").trim();
    const newVal = c.dialCode + (numberPart ? " " + numberPart : " ");
    onChange(newVal, c);
    if (onCountryChange) onCountryChange(c);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const displayValue = value.startsWith(currentCountryData.dialCode)
    ? value.substring(currentCountryData.dialCode.length).trim()
    : value.replace(currentCountryData.dialCode, "").trim();

  if (isLoading) {
    return (
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex items-center px-3 py-3 bg-gray-50 border-r border-gray-300">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
        </div>
        <input
          type="tel"
          className="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none bg-gray-100"
          placeholder="Loading countries..."
          disabled
        />
      </div>
    );
  }

  return (

    <div className="relative">

      <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((s) => !s)}
          disabled={disabled}
          className="flex items-center px-3 py-3 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 focus:outline-none transition-colors"
        >
          <span className="text-lg mr-2">{currentCountryData.flag}</span>
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-1">
            {currentCountryData.dialCode}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        <input
          type="tel"
          value={displayValue}
          onChange={handlePhoneChange}
          onPaste={handlePaste}
          inputMode="tel"
          onKeyDown={(e) => {
            // allow navigation keys, backspace, delete, arrows, tab
            const allowedKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Tab",
            ];
            if (allowedKeys.includes(e.key)) return;

            // allow plus and space
            if (e.key === "+" || e.key === " ") return;

            // if not a digit suppress
            if (!/^\d$/.test(e.key)) {
              e.preventDefault();
              return;
            }

            // compute digits in dial + current displayValue
            const currentLocalDigits = onlyDigits((e.currentTarget as HTMLInputElement).value).length;
            const dialDigits = onlyDigits(currentCountryData.dialCode).length;
            // If user selects all and types, e.currentTarget.value might be replaced; still, be conservative
            if (dialDigits + currentLocalDigits >= MAX_DIGITS) {
              e.preventDefault();
            }
          }}
          className="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c)}
                  className="w-full px-3 py-2 flex items-center hover:bg-gray-50 text-left"
                >
                  <span className="text-lg mr-3">{c.flag}</span>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{c.dialCode}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No countries found</div>
            )}
          </div>
        </div>
      )}

      {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
    </div>
  );
};

/* -----------------------
   Main Component
   ----------------------- */

const QuotationTool: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showQuote, setShowQuote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStep1, setIsLoadingStep1] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState("mu"); // iso2 code

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    country: "",
    websiteType: "",
    products: "",
    insertProducts: "",
    pages: "",
    designStyle: "",
    features: [],
    timeline: "",
    hosting: "",
    domain: "",
    whatsappNumber: "+230 ",
    email: "",
    comments: "",
  });

  const [pricing, setPricing] = useState<PricingData>({
    basePrice: 0,
    productsPrice: 0,
    insertProductsPrice: 0,
    pagesPrice: 0,
    designPrice: 0,
    featuresPrice: 0,
    timelinePrice: 0,
    hostingPrice: 0,
    domainPrice: 0,
    totalPrice: 0,
  });

  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<ConvertedPrice>({ amount: 0, currency: "MUR" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    initGoogleAnalytics();
    trackEvent("page_view", "QuotationTool", "Tool Loaded");
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoadingStep1 && countdown > 0) {
      timer = setTimeout(() => setCountdown((p) => p - 1), 1000);
    } else if (!isLoadingStep1) {
      setCountdown(0);
    }
    return () => clearTimeout(timer);
  }, [isLoadingStep1, countdown]);

  /* Pricing maps */
  const basePriceMap: Record<FormData["websiteType"], number> = {
    landing: 12000,
    corporate: 12000,
    ecommerce: 15000,
    "": 0,
  };
  const productsPriceMap: Record<FormData["products"], number> = {
    "1-10": 3000,
    "11-50": 4000,
    "51-200": 5000,
    "200-500": 6000,
    "": 0,
  };
  const insertProductsPriceMap: Record<FormData["insertProducts"], number> = {
    "insert-all": 3000,
    "provide-training": 1000,
    "": 0,
  };
  const pagesPriceMap: Record<FormData["pages"], number> = {
    "1-3": 3000,
    "4-7": 6000,
    "8-15": 10000,
    "15+": 20000,
    "": 0,
  };
  const designPriceMap: Record<FormData["designStyle"], number> = {
    template: 2000,
    "semi-custom": 4000,
    "fully-custom": 7000,
    "not-sure": 3000,
    "": 0,
  };
  const featurePrices: Record<FeatureKey, number> = {
    "contact-form": 2000,
    "whatsapp-chat": 1500,
    "messenger-chat": 1500,
    blog: 1000,
    "payment-gateway": 10000,
    "multi-language": 6000,
    booking: 8000,
    gallery: 1000,
    newsletter: 1500,
  };
  const timelinePriceMap: Record<FormData["timeline"], number> = {
    "6-8-weeks": 0,
    "3-5-weeks": 1000,
    "2-4-weeks": 2000,
    "<2-weeks": 3000,
    "": 0,
  };
  const hostingPriceMap: Record<FormData["hosting"], number> = {
    "bim africa to provide": 2000,
    client: 500,
    "": 0,
  };
  const domainPriceMap: Record<FormData["domain"], number> = {
    "bim africa to provide": 1000,
    client: 0,
    "": 0,
  };

  const getInsertAllPrice = (): number => {
    switch (formData.products) {
      case "1-10":
        return 0;
      case "11-50":
        return 6000;
      case "51-200":
        return 12000;
      case "200-500":
        return 18000;
      default:
        return 0;
    }
  };

  const calculatePricing = () => {
    const basePrice = basePriceMap[formData.websiteType] || 0;
    const productsPrice = productsPriceMap[formData.products] || 0;

    let insertProductsPrice = insertProductsPriceMap[formData.insertProducts] || 0;
    if (formData.websiteType === "ecommerce" && formData.insertProducts === "insert-all") {
      insertProductsPrice = getInsertAllPrice();
    }

    const pagesPrice =
      formData.websiteType === "landing" || formData.websiteType === "ecommerce"
        ? 0
        : pagesPriceMap[formData.pages] || 0;

    const designPrice = designPriceMap[formData.designStyle] || 0;
    const featuresPrice = formData.features.reduce((sum, f) => sum + (featurePrices[f] || 0), 0);
    const timelinePrice = timelinePriceMap[formData.timeline] || 0;
    const hostingPrice = hostingPriceMap[formData.hosting] || 0;
    const domainPrice = domainPriceMap[formData.domain] || 0;

    const totalPrice =
      basePrice +
      productsPrice +
      insertProductsPrice +
      pagesPrice +
      designPrice +
      featuresPrice +
      timelinePrice +
      hostingPrice +
      domainPrice;

    setPricing({
      basePrice,
      productsPrice,
      insertProductsPrice,
      pagesPrice,
      designPrice,
      featuresPrice,
      timelinePrice,
      hostingPrice,
      domainPrice,
      totalPrice,
    });
  };

  useEffect(() => {
    calculatePricing();
  }, [formData]);

  useEffect(() => {
    if ((formData.websiteType === "ecommerce" || formData.websiteType === "landing") && formData.pages !== "") {
      setFormData((p) => ({ ...p, pages: "" }));
      setErrors((e) => {
        const copy = { ...e };
        delete copy.pages;
        return copy;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.websiteType]);

  /* Currency conversion */
  useEffect(() => {
    const country = formData.country ? formData.country : null;
    const baseMUR = pricing.totalPrice || 0;

    if (!country) {
      setConvertedPrice({ amount: baseMUR, currency: "MUR" });
      return;
    }

    const rule = COUNTRY_RULES[country as Exclude<CountryKey, "">];
    if (!rule) {
      setConvertedPrice({ amount: baseMUR, currency: "MUR" });
      return;
    }

    const afterMultiplier = baseMUR * rule.multiplier;
    const amount = rule.op === "divide" ? afterMultiplier / rule.rate : afterMultiplier * rule.rate;

    setConvertedPrice({ amount, currency: rule.currency });
  }, [formData.country, pricing.totalPrice]);

  const converted = useMemo(() => convertedPrice, [convertedPrice]);

  const handleInput = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [String(key)]: "" }));
    trackEvent("form_interaction", "QuotationTool", `${String(key)}_changed`, 0);
  };

  // handle phone component changes (value + detected CountryData)
  const handleWhatsAppInput = (value: string, country: CountryData) => {
    // update whatsapp text
    handleInput("whatsappNumber", value as FormData["whatsappNumber"]);
    // make phone component show the detected iso code
    setSelectedPhoneCountry(country.code);
    // pass full CountryData into handleCountryChange so we can use detected dial
    handleCountryChange(country);
  };

  // map country label to your COUNTRY_OPTIONS entry (if possible)
  // Accept either a string or CountryData (detected)
  const handleCountryChange = (countryArg: string | CountryData) => {
    const countryName = typeof countryArg === "string" ? countryArg : countryArg.name;
    const detectedDial = typeof countryArg === "object" ? countryArg.dialCode : undefined;
    const detectedIso = typeof countryArg === "object" ? countryArg.code : undefined;

    const matchingCountry = COUNTRY_OPTIONS.find(
      (c) =>
        c.toLowerCase() === countryName.toLowerCase() ||
        countryName.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(countryName.toLowerCase())
    );

    if (matchingCountry) {
      // exact/near match found -> set that
      handleInput("country", matchingCountry as CountryKey);
      // also set phone component iso code where possible (via map)
      const iso = COUNTRY_NAME_TO_ISO[matchingCountry.toLowerCase()];
      if (iso) setSelectedPhoneCountry(iso);
      // Note: useEffect on formData.country will update whatsappNumber prefix (unless country === Other Countries)
    } else {
      // no match -> treat it as "Other Countries" BUT use detected dial if available
      handleInput("country", "Other Countries");
      // set phone component iso code to detected or fallback 'oc'
      setSelectedPhoneCountry(detectedIso || "oc");

      // update whatsappNumber using the detected dial code (if provided) or fallback to +000
      setFormData((prev) => {
        const prevNumber = prev.whatsappNumber || "";
        // keep the number-part only (strip any leading dial)
        const numberPart = prevNumber.replace(/^\+?[0-9]+\s*/, "").trim();
        const dial = detectedDial || "+000";
        return { ...prev, whatsappNumber: `${dial}${numberPart ? " " + numberPart : " "}` };
      });
    }
  };

  const toggleFeature = (feature: FeatureKey) => {
    setFormData((p) =>
      p.features.includes(feature) ? { ...p, features: p.features.filter((f) => f !== feature) } : { ...p, features: [...p.features, feature] }
    );
    setErrors((e) => ({ ...e, features: "" }));
    const isSelected = !formData.features.includes(feature);
    trackEvent("feature_toggle", "QuotationTool", `${feature}_${isSelected ? "selected" : "deselected"}`);
  };

  const isValidEmail = (value: string) => {
    if (!value.includes("@")) return false;
    const re = /^\S+@\S+\.\S+$/;
    return re.test(value);
  };

  // UPDATED phone validation:
  // - Minimum 9 digits, maximum 15 digits (total digits across country code + local part)
  const isValidPhone = (phone: string) => {
    const raw = (phone || "").trim();
    if (!raw) return false;

    // normalize: remove spaces but keep '+'
    const normalized = raw.replace(/\s+/g, "");

    // helper to get only digits
    const onlyDigits = (s: string) => s.replace(/\D/g, "");
    const totalDigits = onlyDigits(normalized).length;

    const MIN = 9;
    const MAX = 17;

    // require between MIN and MAX digits
    return totalDigits >= MIN && totalDigits <= MAX;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.country) newErrors.country = "Please select your country";

      if (!formData.whatsappNumber.trim()) {
        newErrors.whatsappNumber = "WhatsApp number is required";
      } else if (!isValidPhone(formData.whatsappNumber)) {
        newErrors.whatsappNumber = "Please enter a valid phone number (include country code or enter local number). Must be between 9 and 17 digits.";
      }

      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!isValidEmail(formData.email)) newErrors.email = "Email must be valid and include '@'";
    }

    if (step === 2) {
      if (!formData.websiteType) newErrors.websiteType = "Please select website type";
      if (formData.websiteType === "ecommerce") {
        if (!formData.products) newErrors.products = "Select products range";
        if (!formData.insertProducts) newErrors.insertProducts = "Choose insert products option";
      }
      if (formData.websiteType !== "landing" && formData.websiteType !== "ecommerce" && !formData.pages) {
        newErrors.pages = "Select number of pages";
      }
      if (!formData.designStyle) newErrors.designStyle = "Select design style";
    }

    if (step === 3) {
      if (!formData.timeline) newErrors.timeline = "Select timeline";
      if (!formData.hosting) newErrors.hosting = "Select hosting option";
      if (!formData.domain) newErrors.domain = "Select domain option";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      trackEvent("validation_error", "QuotationTool", `step_${step}_error`, Object.keys(newErrors).length);
      const firstKey = Object.keys(newErrors)[0];
      window.alert(newErrors[firstKey]);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(3, s + 1));
      trackEvent("step_completed", "QuotationTool", `step_${currentStep}_completed`);
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
    trackEvent("step_back", "QuotationTool", `back_to_step_${Math.max(1, currentStep - 1)}`);
  };

  /* Save basic info to server */
  const isCountrySupported = (country?: string | null) => {
    return !!country && COUNTRY_OPTIONS.includes(country as CountryKey);
  };

  const saveBasicToServer = async (): Promise<string | null> => {
    if (!isCountrySupported(formData.country)) {
      window.alert("Selected country is not supported for API saving. The form will continue but data will not be saved remotely.");
      return null;
    }

    const payload = {
      name: formData.fullName,
      companyName: formData.companyName,
      country: formData.country,
      email: formData.email,
      number: formData.whatsappNumber,
    };

    try {
      const res = await fetch(`https://backend-instant-quote.vercel.app/save-basic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("save-basic error:", errorData);
        window.alert(errorData.error || "Failed to save basic info. You can still continue.");
        return null;
      }

      const data = await res.json();
      if (data && data.id) return data.id;
      return null;
    } catch (err) {
      console.error("Network error saving basic info:", err);
      window.alert("Network error while saving basic info. You can still continue.");
      return null;
    }
  };

  const handleNextFromStep1 = async () => {
    if (!validateStep(1)) return;

    if (isLoadingStep1) return;

    setIsLoadingStep1(true);
    setCountdown(7);

    const apiPromise = saveBasicToServer();
    const minLoadingTime = new Promise((r) => setTimeout(r, 7000));
    const [id] = await Promise.all([apiPromise, minLoadingTime]);

    if (id) {
      setSavedId(id);
      trackEvent("basic_info_saved", "QuotationTool", `SavedId:${id}`);
    } else {
      trackEvent("basic_info_save_failed", "QuotationTool", "Save failed or no id returned");
    }

    setIsLoadingStep1(false);
    setCountdown(0);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setIsSubmitting(true);
    trackEvent("quote_submit_started", "QuotationTool", "Quote Submission Started");

    try {
      const rule = formData.country ? COUNTRY_RULES[formData.country as Exclude<CountryKey, "">] : null;
      const finalCurrency = rule ? rule.currency : "MUR";
      const finalAmount = converted.amount;

      const payload: any = {
        id: savedId || undefined,
        name: formData.fullName,
        companyName: formData.companyName,
        email: formData.email,
        number: formData.whatsappNumber,
        country: formData.country,
        websiteType: formData.websiteType,
        designStyle: formData.designStyle,
        features: formData.features,
        timeline: formData.timeline,
        hosting: formData.hosting,
        domain: formData.domain,
        price: finalAmount,
        currency: finalCurrency,
        message: formData.comments || "",
      };

      if (formData.websiteType !== "ecommerce" && formData.pages) payload.pages = formData.pages;
      if (formData.websiteType === "ecommerce") {
        payload.products = formData.products;
        payload.insertProducts = formData.insertProducts;
      }

      if (!isCountrySupported(formData.country)) {
        window.alert("Selected country is not supported by the backend API. The quote will be generated locally.");
        setQuoteNumber("");
        setShowQuote(true);
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`https://backend-instant-quote.vercel.app/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        window.alert(data.error || "Failed to submit quote. Please try again.");
        trackEvent("quote_submit_error", "QuotationTool", data.error || "Submit failed");
      } else {
        window.alert(`Quote sent successfully! Quote Number: ${data.quoteNumber}`);
        setQuoteNumber(data.quoteNumber);
        trackEvent("quote_submit_success", "QuotationTool", `Quote ${data.quoteNumber}`, Math.round(finalAmount));
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "G-M6FWN2GGV0",
            value: Math.round(finalAmount),
            currency: finalCurrency,
            transaction_id: data.quoteNumber,
          });
        }
        setShowQuote(true);
      }
    } catch (err) {
      console.error("Error sending quote:", err);
      window.alert("Failed to send quote. Please try again.");
      trackEvent("quote_submit_error", "QuotationTool", "Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map between your country label and likely ISO2 code used by PhoneInputComponent
  const COUNTRY_NAME_TO_ISO: Record<string, string> = {
    "australia": "au",
    "austria": "at",
    "belgium": "be",
    "canada": "ca",
    "cyprus": "cy",
    "czech republic": "cz",
    "denmark": "dk",
    "estonia": "ee",
    "finland": "fi",
    "france": "fr",
    "germany": "de",
    "ireland": "ie",
    "israel": "il",
    "italy": "it",
    "japan": "jp",
    "luxembourg": "lu",
    "malta": "mt",
    "mauritius": "mu",
    "netherlands": "nl",
    "new zealand": "nz",
    "norway": "no",
    "portugal": "pt",
    "qatar": "qa",
    "reunion island": "re",
    "saudi arabia": "sa",
    "singapore": "sg",
    "slovenia": "si",
    "south africa": "za",
    "south korea": "kr",
    "spain": "es",
    "sweden": "se",
    "switzerland": "ch",
    "united arab emirates": "ae",
    "united states": "us",
    "united kingdom": "gb",
    "other countries": "oc",
  };

  // static dial map to set whatsappNumber when user selects country from main select
  const STATIC_DIAL_MAP: Record<string, string> = {
    australia: "+61",
    austria: "+43",
    belgium: "+32",
    canada: "+1",
    cyprus: "+357",
    "czech republic": "+420",
    denmark: "+45",
    estonia: "+372",
    finland: "+358",
    france: "+33",
    germany: "+49",
    ireland: "+353",
    israel: "+972",
    italy: "+39",
    japan: "+81",
    luxembourg: "+352",
    malta: "+356",
    mauritius: "+230",
    netherlands: "+31",
    "new zealand": "+64",
    norway: "+47",
    portugal: "+351",
    qatar: "+974",
    "reunion island": "+262",
    "saudi arabia": "+966",
    singapore: "+65",
    slovenia: "+386",
    "south africa": "+27",
    "south korea": "+82",
    spain: "+34",
    sweden: "+46",
    switzerland: "+41",
    "united arab emirates": "+971",
    "united states": "+1",
    "united kingdom": "+44",
    "other countries": "+000",
  };

  // When user selects country from main <select>, update phone prefix and phone-component iso
  // NOTE: do NOT overwrite the detected dial when the country is "Other Countries"
  useEffect(() => {
    if (!formData.country) return;
    const key = formData.country.toLowerCase();

    // if user or detector set "Other Countries", do NOT auto-overwrite the whatsappNumber
    if (key === "other countries") return;

    const dial = STATIC_DIAL_MAP[key];
    const iso = COUNTRY_NAME_TO_ISO[key];
    if (dial) {
      setFormData((prev) => {
        const prevNumber = prev.whatsappNumber || "";
        // extract number-part (strip any leading dial)
        const numberPart = prevNumber.replace(/^\+?[0-9]+\s*/, "").trim();
        return { ...prev, whatsappNumber: `${dial}${numberPart ? " " + numberPart : " "}` };
      });
    }
    if (iso) setSelectedPhoneCountry(iso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.country]);

  if (showQuote) {
    const rule = formData.country ? COUNTRY_RULES[formData.country as Exclude<CountryKey, "">] : null;
    const finalCurrency = rule ? rule.currency : "MUR";
    const finalAmount = converted.amount;

    return (
      <div className="min-h-screen  py-6 sm:py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className=" rounded-2xl shadow-xl p-6 md:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-[25%] h-16 mb-6">
                <img src={logo} alt="logo" />
              </div>


              {quoteNumber && (
                <div className="mb-3">
                  <span className="text-xs sm:text-sm text-gray-500 mr-2">Quote #</span>
                  <span className="inline-block font-mono bg-gray-100 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                    {quoteNumber}
                  </span>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Your Quote is Ready!</h1>
            </div>

            <div className="bg-[#0b0b0b] border border-[#1f2937] rounded-lg p-4 sm:p-6 mb-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-700">Quote Summary</h2>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between text-red-700"><span>Country:</span><span className="font-medium capitalize">{formData.country || "—"}</span></div>
                <div className="flex justify-between text-red-700"><span>Website Type:</span><span className="font-medium capitalize">{formData.websiteType || "—"}</span></div>
                {formData.websiteType !== "landing" && formData.websiteType !== "ecommerce" && (<div className="flex justify-between"><span>Pages:</span><span className="font-medium capitalize">{formData.pages || "—"}</span></div>)}
                <div className="flex justify-between text-red-700"><span>Design:</span><span className="font-medium capitalize">{formData.designStyle || "—"}</span></div>
                <div className="flex justify-between text-red-700"><span>Features:</span><span className="font-medium capitalize">{formData.features.map(f => f.replace(/-/g, " ")).join(", ") || "None"}</span></div>
                <div className="flex justify-between text-red-700"><span>Timeline:</span><span className="font-medium capitalize">{formData.timeline || "—"}</span></div>
                <div className="flex justify-between text-red-700"><span>Hosting:</span><span className="font-medium capitalize">{formData.hosting || "—"}</span></div>
                <div className="flex justify-between text-red-700"><span>Domain:</span><span className="font-medium capitalize">{formData.domain || "—"}</span></div>
                <div className="flex justify-between text-red-700"><span>Number:</span><span className="font-medium">{formData.whatsappNumber || "—"}</span></div>
                <hr className="my-4" />
                <div className="flex justify-between text-base sm:text-lg font-bold text-red-700">
                  <span>Final Price:</span>
                  <span className="red-700">{finalCurrency} {Math.round(finalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-red-700">
              <p className="mb-2">We will contact you shortly to discuss further.</p>
              <p className="font-medium">Best Regards,</p>
              <p className="font-bold">Sales Team - BIM Africa</p>
              <a className="text-red-700" href="https://bim.africa/" target="_blank" rel="noreferrer">www.bim.africa</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white ">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-16 rounded-full mb-6">
            
          </div>
          <h1 className="md:text-4xl text-2xl font-bold mb-4">
            <span className="text-red-700">Instant</span>
            <span className="text-white">Website Quotation Tool</span>
          </h1>

          <p className="md:text-xl text-lg text-white max-w-[320px] md:max-w-3xl mx-auto">Know your website cost in under 2 minutes — transparent, automatic, and secure</p>
          <div className="flex flex-wrap max-md:max-w-[320px] items-center justify-center mt-5 gap-2 mx-auto md:gap-4">
  <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-[#0b0b0b] px-4 py-2">
    <Lock size={16} className="text-red-600" />
    <span className="text-sm font-medium text-white">SSL Encrypted</span>
  </div>

  <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-[#0b0b0b] px-4 py-2">
    <Globe2 size={16} className="text-red-600" />
    <span className="text-sm font-medium text-white">GDPR Compliant</span>
  </div>

  <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-[#0b0b0b] px-4 py-2">
    <ShieldCheck size={16} className="text-red-600" />
    <span className="text-sm font-medium text-white">Trusted Worldwide</span>
  </div>
</div>

        </div>
{/* Progress */}
<div className="mb-8 relative overflow-hidden">
  {/* background only, no layout impact */}
  <div className="absolute inset-0 rounded-full bg-black/40 border border-gray-800/60 pointer-events-none" />

  <div className="relative px-1 sm:px-5 py-3">
    {/* Progress */} 
    <div className="flex items-center justify-center space-x-4">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          {/* number circle */}
          <div
            className={`sm:w-10 h-7 sm:h-10 w-7 rounded-full flex items-center justify-center text-sm font-semibold
              ${currentStep === s ? "bg-red-700 text-white shadow-[0_0_20px_rgba(185,28,28,0.3)]" : "bg-[#2b2b2b] text-gray-300"}`}
          >
            {s}
          </div>

          {/* label inline (right of the number) */}
          <span
            className={`md:ml-3 ml-1 max-sm:text-[13px] sm:text-sm font-medium ${
              currentStep === s ? "text-red-700" : "text-red-700"
            }`}
          >
            {["Basic Info", "Website Details", "Final Details"][s - 1]}
          </span>

          {/* separator */}
          {s < 3 && (
            <div className="max-w-16 h-[6px] max-md:hidden rounded-full mx-2 sm:mx-4 bg-gray-700/40" />
          )}
        </div>
      ))}
    </div>
  </div>
</div>



        <div className="rounded-2xl shadow-xl p-8 md:p-12 bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb]">
          
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Basic Information</h2>
              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={(e) => handleInput("fullName", e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-lg bg-[#0b0b0b] text-[#e5e7eb]
               border border-[#1f2937]
               outline-none focus:outline-none
               ring-0 focus:ring-0 focus:ring-offset-0
               focus:border-red-700"
 disabled={isLoadingStep1} />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Company Name</label>
                  <input type="text" value={formData.companyName} onChange={(e) => handleInput("companyName", e.target.value)} placeholder="Enter your company name" className="w-full px-4 py-3 rounded-lg bg-[#0b0b0b] text-[#e5e7eb]
               border border-[#1f2937]
               outline-none focus:outline-none
               ring-0 focus:ring-0 focus:ring-offset-0
               focus:border-red-700"
   disabled={isLoadingStep1} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Country</label>
                <select value={formData.country} onChange={(e) => handleInput("country", e.target.value as CountryKey)} className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb]" disabled={isLoadingStep1}>
                  <option value="">Select your country</option>
                  {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                <p className="text-xs text-gray-300 mt-1">Prices are calculated internally in MUR; your final total will be shown in your currency.</p>
                <div className="mt-2"><p className="text-sm text-white">Converted total: <span className="font-medium">{convertedPrice.currency} {Math.round(convertedPrice.amount).toLocaleString()}</span></p></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
<style>{`
/* =========================
   PHONE INPUT (dark) + DROPDOWN
   ========================= */

/* Flag + tel input inside the bordered wrapper */
div[class*="flex"][class*="border"][class*="rounded-lg"] > input[type="tel"],
div[class*="flex"][class*="border"][class*="rounded-lg"] > button[class*="flex"][class*="items-center"] + input[type="tel"] {
  background-color: #0b0b0b !important;
  color: #e5e7eb !important;
  border-radius: 0.5rem !important;
  width: 100% !important;
  height: 3rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  box-sizing: border-box !important;
}

/* Flag button area */
div[class*="flex"][class*="border"][class*="rounded-lg"] > button[class*="flex"][class*="items-center"] {
  background-color: #0b0b0b !important;
  color: #e5e7eb !important;
  height: 3rem !important;
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
  box-sizing: border-box !important;
}

/* Disabled / placeholder */
div[class*="flex"][class*="border"][class*="rounded-lg"] input[disabled][type="tel"],
div[class*="flex"][class*="border"][class*="rounded-lg"] input[placeholder*="Loading"] {
  background-color: #0b0b0b !important;
  color: #e5e7eb !important;
}

/* Country dropdown panel */
div[class*="absolute"][class*="z-50"][class*="w-full"] {
  background-color: #0b0b0b !important;
  color: #e5e7eb !important;
  border: 1px solid #1f2937 !important;
}

/* Search in dropdown */
div[class*="absolute"][class*="z-50"] input[type="text"] {
  background-color: #0b0b0b !important;
  color: #e5e7eb !important;
  border: 1px solid #1f2937 !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem !important;
}

/* Country rows */
div[class*="absolute"][class*="z-50"] button {
  background: transparent !important;
  color: #e5e7eb !important;
  text-align: left !important;
}
div[class*="absolute"][class*="z-50"] button:hover {
  background-color: #111111 !important;
}

/* =========================
   FOCUS STATES (NO BLUE, ONLY RED-700)
   ========================= */

/* Kill Tailwind blue ring and show only solid red-700 when wrapper focused */
div[class*="focus-within:ring-blue-500"]:focus-within,
div[class*="flex"][class*="border"][class*="rounded-lg"]:focus-within {
  /* no glow/ring */
  --tw-ring-offset-shadow: 0 0 #0000 !important;
  --tw-ring-shadow: 0 0 #0000 !important;
  --tw-ring-color: transparent !important;
  box-shadow: none !important;

  /* only crisp red border */
  border-color: #b91c1c !important;   /* red-700 */
  border-width: 2px !important;
}

/* Inputs/buttons inside wrapper: remove blue outline/ring fully */
div[class*="flex"][class*="border"][class*="rounded-lg"] input[type="tel"]:focus,
div[class*="flex"][class*="border"][class*="rounded-lg"] input[type="tel"]:focus-visible,
div[class*="flex"][class*="border"][class*="rounded-lg"] button[class*="items-center"]:focus,
div[class*="flex"][class*="border"][class*="rounded-lg"] button[class*="items-center"]:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  --tw-ring-offset-shadow: 0 0 #0000 !important;
  --tw-ring-shadow: 0 0 #0000 !important;
  --tw-ring-color: transparent !important;
}

/* Any element that has focus:ring-blue-500 (e.g., dropdown search input) */
*[class*="focus:ring-blue-500"]:focus,
*[class*="focus:ring-blue-500"]:focus-visible {
  --tw-ring-offset-shadow: 0 0 #0000 !important;
  --tw-ring-shadow: 0 0 #0000 !important;
  --tw-ring-color: transparent !important;
  box-shadow: none !important;
  border-color: #b91c1c !important;   /* stay consistent red focus */
}

/* Fallback for any tel input in dark card */
.rounded-2xl input[type="tel"] {
  background-color: #0b0b0b !important;
  color: #e5e7eb !important;
}

/* Native <select> focus look */
select:focus,
select:focus-visible {
  outline: none !important;
  border-color: #b91c1c !important;
  color: #b91c1c !important;
  background-color: #0b0b0b !important;
}

/* =========================
   RADIO CARDS (NO WHITE BORDER)
   ========================= */

/* Label text next to radio -> white */
label input[type="radio"] + .text-gray-700 { color: #ffffff !important; }

/* Radio dot -> red-700 */
label input[type="radio"] { accent-color: #b91c1c; }

/* Default border = dark gray (no white anywhere) */
label[class*="border"][class*="rounded"],
div[class*="border"][class*="rounded"] { border-color: #1f2937 !important; }

label.border-white,
div.border-white,
label[class*="border-white"],
div[class*="border-white"] { border-color: #1f2937 !important; }

/* Selected card -> solid red-700, no shadow */
label:has(input[type="radio"]:checked),
div:has(input[type="radio"]:checked) { border-color: #b91c1c !important; }
`}</style>



                  <label className="block text-sm font-medium text-white mb-2 ">WhatsApp Number</label>
                  <PhoneInputComponent
                    value={formData.whatsappNumber}
                    onChange={handleWhatsAppInput}
                    selectedCountry={selectedPhoneCountry}
                    disabled={isLoadingStep1}
                    placeholder="Enter phone number"
                    onCountryChange={handleCountryChange}
                    
  />
                  {errors.whatsappNumber && <p className="text-red-600 text-sm mt-1">{errors.whatsappNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => handleInput("email", e.target.value)} placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg bg-[#0b0b0b] text-[#e5e7eb]
               border border-[#1f2937]
               outline-none focus:outline-none
               ring-0 focus:ring-0 focus:ring-offset-0
               focus:border-red-700"
 disabled={isLoadingStep1} />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            

<p className="flex items-center text-sm text-[#e5e7eb]">
  <Shield size={16} className="text-red-700 mr-2" />
  Your data is secure and GDPR protected
</p>

            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-red-700 mb-6">Website Details</h2>
<style>{`
  /* Make the label text next to the radio white, without touching your JSX/classes */
  label input[type="radio"] + .text-gray-700 {
    color: #ffffff !important;
  }
     /* Make radio dot red-700 instead of blue */
  label input[type="radio"] {
    accent-color: #b91c1c; /* red-700 */
  }
      /* SELECTED box ka border red-700 */
  label:has(input[type="radio"]:checked) {
    border-color: #b91c1c !important;
  }
`}</style>

<div>
  <label className="block text-sm font-medium text-white mb-4">What type of website do you need?</label>
  <div className="space-y-3">
    {[
      { value: "landing", label: "Landing Page (One Pager)" },
      { value: "corporate", label: "Corporate Website" },
      { value: "ecommerce", label: "E-Commerce Website" },
    ].map((o) => (
      <label key={o.value} className="flex items-center p-4 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
        <input type="radio" name="websiteType" value={o.value} checked={formData.websiteType === (o.value as any)} onChange={(e) => handleInput("websiteType", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
        <span className="ml-3 text-sm font-medium text-gray-700">{o.label}</span>
      </label>
    ))}
  </div>
  {errors.websiteType && <p className="text-red-600 text-sm mt-1">{errors.websiteType}</p>}
</div>


              {formData.websiteType === "ecommerce" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-4">How many products will be inserted? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: "1-10", label: "1-10" },
                        { value: "11-50", label: "11-50" },
                        { value: "51-200", label: "51-200" },
                        { value: "200-500", label: "200-500" },
                      ].map((o) => (
                        <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                          <input type="radio" name="products" value={o.value} checked={formData.products === (o.value as any)} onChange={(e) => handleInput("products", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                          <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.products && <p className="text-red-600 text-sm mt-1">{errors.products}</p>}
                  </div>

                  {formData.products && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-4">Insert products or training?</label>
                      <div className="space-y-3">
                        {[
                          { value: "insert-all", label: `Insert all → + MUR ${getInsertAllPrice().toLocaleString()}` },
                          { value: "provide-training", label: "Provide training → + MUR 1,000" },
                        ].map((o) => (
                          <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                            <input type="radio" name="insertProducts" value={o.value} checked={formData.insertProducts === (o.value as any)} onChange={(e) => handleInput("insertProducts", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                            <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.insertProducts && <p className="text-red-600 text-sm mt-1">{errors.insertProducts}</p>}
                    </div>
                  )}
                </>
              )}

              {formData.websiteType !== "landing" && formData.websiteType !== "ecommerce" && (
                <div>
                  <label className="block text-sm font-medium text-white-700 mb-4">Number of Pages</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: "1-3", label: "1-3" },
                      { value: "4-7", label: "4-7" },
                      { value: "8-15", label: "8-15" },
                      { value: "15+", label: "15+" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                        <input type="radio" name="pages" value={o.value} checked={formData.pages === (o.value as any)} onChange={(e) => handleInput("pages", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                        <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.pages && <p className="text-red-600 text-sm mt-1">{errors.pages}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white-700 mb-4">Design Style *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "template", label: "Template" },
                    { value: "semi-custom", label: "Semi-custom" },
                    { value: "fully-custom", label: "Fully custom" },
                    { value: "not-sure", label: "Not sure" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                      <input type="radio" name="designStyle" value={o.value} checked={formData.designStyle === (o.value as any)} onChange={(e) => handleInput("designStyle", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="ml-3 text-sm text-white">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.designStyle && <p className="text-red-600 text-sm mt-1">{errors.designStyle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Features (checkboxes, sum prices)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {([
                    { value: "contact-form", label: "Contact Form" },
                    { value: "whatsapp-chat", label: "WhatsApp Chat" },
                    { value: "messenger-chat", label: "Messenger Chat" },
                    { value: "blog", label: "Blog" },
                    { value: "payment-gateway", label: "Payment Gateway" },
                    { value: "multi-language", label: "Multi-language" },
                    { value: "booking", label: "Booking" },
                    { value: "gallery", label: "Gallery" },
                    { value: "newsletter", label: "Newsletter" },
                  ] as { value: FeatureKey; label: string }[]).map((o) => (
                    <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                      <input type="checkbox" checked={formData.features.includes(o.value)} onChange={() => toggleFeature(o.value)} className="w-4 h-4 accent-red-700 border-gray-300 focus:ring-red-700" />
                      <span className="ml-3 text-sm text-white">{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Final Details</h2>
              <style>{`
  /* Make the label text next to the radio white, without touching your JSX/classes */
  label input[type="radio"] + .text-gray-700 {
    color: #ffffff !important;
  }
     /* Make radio dot red-700 instead of blue */
  label input[type="radio"] {
    accent-color: #b91c1c; /* red-700 */
  }
      /* SELECTED box ka border red-700 */
  label:has(input[type="radio"]:checked) {
    border-color: #b91c1c !important;
  }
`}</style>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Timeline</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "6-8-weeks", label: "6-8 weeks → No change" },
                    { value: "3-5-weeks", label: "3-5 weeks" },
                    { value: "2-4-weeks", label: "2-4 weeks" },
                    { value: "<2-weeks", label: "<2 weeks" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                      <input type="radio" name="timeline" value={o.value} checked={formData.timeline === (o.value as any)} onChange={(e) => handleInput("timeline", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.timeline && <p className="text-red-600 text-sm mt-1">{errors.timeline}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Hosting</label>
                <div className="space-y-3">
                  {[
                    { value: "bim africa to provide", label: "BIM Africa to provide" },
                    { value: "client", label: "Client to provide" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3  focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                      <input type="radio" name="hosting" value={o.value} checked={formData.hosting === (o.value as any)} onChange={(e) => handleInput("hosting", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="ml-3 text-sm text-white">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.hosting && <p className="text-red-600 text-sm mt-1">{errors.hosting}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Domain</label>
                <div className="space-y-3">
                  {[
                    { value: "bim africa to provide", label: "BIM Africa purchases (non-premium)" },
                    { value: "client", label: "Client purchases → No change" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 focus:ring-2 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg">
                      <input type="radio" name="domain" value={o.value} checked={formData.domain === (o.value as any)} onChange={(e) => handleInput("domain", e.target.value as any)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <span className="ml-3 text-sm text-white">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.domain && <p className="text-red-600 text-sm mt-1">{errors.domain}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Comments</label>
                <textarea value={formData.comments} onChange={(e) => handleInput("comments", e.target.value)} rows={4} className="w-full px-4 py-3 focus:ring-red-700 focus:border-red-700   bg-[#0b0b0b] border border-[#1f2937] text-[#e5e7eb] rounded-lg" placeholder="Any additional comments or requirements..." />
              </div>
            </div>
          )}

          {/* Live Price Display */}
          {pricing.totalPrice > 0 && (
            <div className="mt-8 p-6 \ rounded-lg bg-[#0b0b0b] border border-[#1f2937]">
              <h3 className="text-lg font-semibold text-red-700 mb-4">Live Price Calculation</h3>
              <div className="space-y-2 text-sm text-red-700">
                {(() => {
                  const convertPrice = (price: number) => {
                    if (!formData.country) return price;
                    const countryRule = COUNTRY_RULES[formData.country as Exclude<CountryKey, "">];
                    const base = price * countryRule.multiplier;
                    return countryRule.op === "divide" ? base / countryRule.rate : base * countryRule.rate;
                  };

                  return (
                    <>
                      {pricing.basePrice > 0 && (
                        <div className="flex justify-between">
                          <span>Base Price ({formData.websiteType}):</span>
                          <span>{convertedPrice.currency} {Math.round(convertPrice(pricing.basePrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.productsPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Products ({formData.products}):</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.productsPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.insertProductsPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Insert Products:</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.insertProductsPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.pagesPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Pages ({formData.pages}):</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.pagesPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.designPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Design ({formData.designStyle}):</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.designPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.featuresPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Features:</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.featuresPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.timelinePrice > 0 && (
                        <div className="flex justify-between">
                          <span>Timeline ({formData.timeline}):</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.timelinePrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.hostingPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Hosting:</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.hostingPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      {pricing.domainPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Domain:</span>
                          <span>+ {convertedPrice.currency} {Math.round(convertPrice(pricing.domainPrice)).toLocaleString()}</span>
                        </div>
                      )}
                      <hr className="border-red-700" />
                      <div className="flex justify-between text-lg font-bold text-red-700">
                        <span>Total Price:</span>
                        <span>{convertedPrice.currency} {Math.round(convertedPrice.amount).toLocaleString()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between mt-8 space-y-4 md:space-y-0 md:space-x-4">
            <button onClick={prevStep} disabled={currentStep === 1 || isLoadingStep1} className="flex items-center px-6 py-3 text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </button>

            {currentStep < 3 ? (
              <button onClick={currentStep === 1 ? handleNextFromStep1 : nextStep} disabled={isLoadingStep1} className="flex items-center px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-[#e1291c] disabled:bg-gray-400">
                {isLoadingStep1 ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Please Wait {countdown > 0 ? `(${countdown}s)` : ""}
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center px-8 py-3 bg-red-700 text-white rounded-lg hover:bg-[#e1291c] disabled:bg-gray-400">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending Quote...
                  </>
                ) : (
                  <>Finalize Instant Quote</>
                )}
              </button>
            )}
          </div>
        </div>
       <p className="text-center text-sm mt-5 text-[#e5e7eb]">
  By continuing, you agree to our{" "}
  <a href="/terms" className="text-red-700 hover:underline">
    Terms of Service
  </a>{" "}
  and{" "}
  <a href="/privacy" className="text-red-700 hover:underline">
    Privacy Policy
  </a>
</p>

      </div>
    </div>
  );
};

export default QuotationTool;
