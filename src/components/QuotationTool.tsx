import React, { useEffect, useMemo, useState } from "react";
import logo from "../Assests/logo.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  | "Other Countries"
  | "";

type ConversionOp = "divide" | "multiply";

interface CountryRule {
  multiplier: number;
  currency: string;
  op: ConversionOp;
  rate: number;
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

// Configuration - change this based on your environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-domain.com' 
  : 'http:https://backend-instant-quote.vercel.app/';

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
   Component
   ----------------------- */

const QuotationTool: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showQuote, setShowQuote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    whatsappNumber: "",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleWhatsAppInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 15);
    handleInput("whatsappNumber", digits as FormData["whatsappNumber"]);
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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.country) newErrors.country = "Please select your country";

      if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = "WhatsApp number is required";
      else if (formData.whatsappNumber.replace(/\D/g, "").length < 10) newErrors.whatsappNumber = "Min 10 digits allowed";
      else if (formData.whatsappNumber.replace(/\D/g, "").length > 15) newErrors.whatsappNumber = "Max 15 digits allowed";

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
  const saveBasicToServer = async (): Promise<string | null> => {
    const payload = {
      name: formData.fullName,
      companyName: formData.companyName,
      country: formData.country,
      email: formData.email,
      number: formData.whatsappNumber,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/save-basic`, {
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
      if (data && data.id) {
        return data.id;
      }
      return null;
    } catch (err) {
      console.error("Network error saving basic info:", err);
      window.alert("Network error while saving basic info. You can still continue.");
      return null;
    }
  };

  const handleNextFromStep1 = async () => {
    if (!validateStep(1)) return;

    const id = await saveBasicToServer();
    if (id) {
      setSavedId(id);
      trackEvent("basic_info_saved", "QuotationTool", `SavedId:${id}`);
    } else {
      trackEvent("basic_info_save_failed", "QuotationTool", "Save failed or no id returned");
    }

    setCurrentStep((s) => Math.min(3, s + 1));
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

      if (formData.websiteType !== "ecommerce" && formData.pages) {
        payload.pages = formData.pages;
      }
      if (formData.websiteType === "ecommerce") {
        payload.products = formData.products;
        payload.insertProducts = formData.insertProducts;
      }

      const response = await fetch(`${API_BASE_URL}/save`, {
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

  if (showQuote) {
    const rule = formData.country ? COUNTRY_RULES[formData.country as Exclude<CountryKey, "">] : null;
    const finalCurrency = rule ? rule.currency : "MUR";
    const finalAmount = converted.amount;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-[25%] h-16 mb-6">
                <img src={logo} alt="logo" />
              </div>

              {quoteNumber && (
                <div className="mb-3">
                  <span className="text-sm text-gray-500 mr-2">Quote #</span>
                  <span className="inline-block font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm font-semibold">{quoteNumber}</span>
                </div>
              )}

              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Quote is Ready!</h1>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Quote Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Country:</span>
                  <span className="font-medium capitalize">{formData.country || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Website Type:</span>
                  <span className="font-medium capitalize">{formData.websiteType || "—"}</span>
                </div>
                {formData.websiteType !== "landing" && formData.websiteType !== "ecommerce" && (
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span className="font-medium capitalize">{formData.pages || "—"}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Design:</span>
                  <span className="font-medium capitalize">{formData.designStyle || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span className="font-medium capitalize">{formData.features.map(f => f.replace(/-/g, " ")).join(", ") || "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeline:</span>
                  <span className="font-medium capitalize">{formData.timeline || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hosting:</span>
                  <span className="font-medium capitalize">{formData.hosting || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <span className="font-medium capitalize">{formData.domain || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number:</span>
                  <span className="font-medium">{formData.whatsappNumber || "—"}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Final Price:</span>
                  <span className="text-[#ff6f61]">{finalCurrency} {Math.round(finalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-600">
              <p className="mb-2">We will contact you shortly to discuss further.</p>
              <p className="font-medium">Best Regards,</p>
              <p className="font-bold">Sales Team - BIM Africa</p>
              <a className="text-blue-600" href="https://bim.africa/" target="_blank" rel="noopener noreferrer">www.bim.africa</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-16 rounded-full mb-6">
            <img src={logo} alt="logo" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BIM Africa - Instant Website Quotation Tool</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get an instant website quotation with live price calculation based on your selections.(Takes less than 2 minutes)
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= s ? " bg-[#ff6f61] text-white" : "bg-gray-200 text-gray-600"}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 mx-2 ${currentStep > s ? "bg-[#ff6f61]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8 text-sm text-gray-600">
            <span className={currentStep >= 1 ? "text-black font-medium" : ""}>Basic Info</span>
            <span className={currentStep >= 2 ? "text-black font-medium" : ""}>Website Details</span>
            <span className={currentStep >= 3 ? "text-black font-medium" : ""}>Final Details</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInput("fullName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInput("companyName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInput("country", e.target.value as CountryKey)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your country</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                <p className="text-xs text-gray-500 mt-1">Prices are calculated internally in MUR; your final total will be shown in your currency.</p>

                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    Converted total: <span className="font-medium">{convertedPrice.currency} {Math.round(convertedPrice.amount).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              {/* WhatsApp & Email on Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleWhatsAppInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter WhatsApp number (max 15 digits)"
                    maxLength={15}
                  />
                  {errors.whatsappNumber && <p className="text-red-600 text-sm mt-1">{errors.whatsappNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInput("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Website Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">What type of website do you need?</label>
                <div className="space-y-3">
                  {[
                    { value: "landing", label: "Landing Page (One Pager) " },
                    { value: "corporate", label: "Corporate Website " },
                    { value: "ecommerce", label: "E-Commerce Website" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="websiteType"
                        value={o.value}
                        checked={formData.websiteType === (o.value as any)}
                        onChange={(e) => handleInput("websiteType", e.target.value as any)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.websiteType && <p className="text-red-600 text-sm mt-1">{errors.websiteType}</p>}
              </div>

              {formData.websiteType === "ecommerce" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">How many products will be inserted? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: "1-10", label: "1-10 " },
                        { value: "11-50", label: "11-50 " },
                        { value: "51-200", label: "51-200" },
                        { value: "200-500", label: "200-500" },
                      ].map((o) => (
                        <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="products"
                            value={o.value}
                            checked={formData.products === (o.value as any)}
                            onChange={(e) => handleInput("products", e.target.value as any)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.products && <p className="text-red-600 text-sm mt-1">{errors.products}</p>}
                  </div>

                  {formData.products && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Insert products or training?</label>
                      <div className="space-y-3">
                        {[
                          { value: "insert-all", label: `Insert all → + MUR ${getInsertAllPrice().toLocaleString()}` },
                          { value: "provide-training", label: "Provide training → + MUR 1,000" },
                        ].map((o) => (
                          <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="insertProducts"
                              value={o.value}
                              checked={formData.insertProducts === (o.value as any)}
                              onChange={(e) => handleInput("insertProducts", e.target.value as any)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
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
                  <label className="block text-sm font-medium text-gray-700 mb-4">Number of Pages</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: "1-3", label: "1-3  " },
                      { value: "4-7", label: "4-7 " },
                      { value: "8-15", label: "8-15 " },
                      { value: "15+", label: "15+" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="pages"
                          value={o.value}
                          checked={formData.pages === (o.value as any)}
                          onChange={(e) => handleInput("pages", e.target.value as any)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.pages && <p className="text-red-600 text-sm mt-1">{errors.pages}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Design Style *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "template", label: "Template  " },
                    { value: "semi-custom", label: "Semi-custom " },
                    { value: "fully-custom", label: "Fully custom " },
                    { value: "not-sure", label: "not sure" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="designStyle"
                        value={o.value}
                        checked={formData.designStyle === (o.value as any)}
                        onChange={(e) => handleInput("designStyle", e.target.value as any)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.designStyle && <p className="text-red-600 text-sm mt-1">{errors.designStyle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Features (checkboxes, sum prices)</label>
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
                    <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(o.value)}
                        onChange={() => toggleFeature(o.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Final Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Timeline</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "6-8-weeks", label: "6-8 weeks → No change" },
                    { value: "3-5-weeks", label: "3-5 weeks " },
                    { value: "2-4-weeks", label: "2-4 weeks " },
                    { value: "<2-weeks", label: "<2 weeks " },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="timeline"
                        value={o.value}
                        checked={formData.timeline === (o.value as any)}
                        onChange={(e) => handleInput("timeline", e.target.value as any)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.timeline && <p className="text-red-600 text-sm mt-1">{errors.timeline}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Hosting</label>
                <div className="space-y-3">
                  {[
                    { value: "bim africa to provide", label: "BIM Africa to provide" },
                    { value: "client", label: "Client to provide" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="hosting"
                        value={o.value}
                        checked={formData.hosting === (o.value as any)}
                        onChange={(e) => handleInput("hosting", e.target.value as any)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.hosting && <p className="text-red-600 text-sm mt-1">{errors.hosting}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Domain</label>
                <div className="space-y-3">
                  {[
                    { value: "bim africa to provide", label: "BIM Africa purchases (non-premium) " },
                    { value: "client", label: "Client purchases → No change" },
                  ].map((o) => (
                    <label key={o.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="domain"
                        value={o.value}
                        checked={formData.domain === (o.value as any)}
                        onChange={(e) => handleInput("domain", e.target.value as any)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.domain && <p className="text-red-600 text-sm mt-1">{errors.domain}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => handleInput("comments", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Any additional comments or requirements..."
                />
              </div>
            </div>
          )}

          {/* Price Display */}
          {pricing.totalPrice > 0 && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Live Price Calculation</h3>
              <div className="space-y-2 text-sm text-blue-800">
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
                      <hr className="border-blue-300" />
                      <div className="flex justify-between text-lg font-bold text-blue-900">
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
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={currentStep === 1 ? handleNextFromStep1 : nextStep}
                className="flex items-center px-6 py-3 bg-[#ff6f61] text-white rounded-lg hover:bg-[#e1291c] transition-all duration-200"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-[#ff6f61] text-white rounded-lg hover:bg-[#e1291c] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
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
      </div>
    </div>
  );
};

export default QuotationTool;