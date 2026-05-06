import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BG_IMAGE = "https://customer-assets.emergentagent.com/job_luxe-design-studio-2/artifacts/prqxmpyt_b354_ho_00_p_1024x768.jpg";
const FAIRMONT_LOGO = "https://customer-assets.emergentagent.com/job_luxe-design-studio-2/artifacts/vull8s52_msa_l_0000681-1.svg";
const ASSET = "https://customer-assets.emergentagent.com/job_luxe-design-studio-2/artifacts";

const CONCIERGE_SECTIONS = [
  {
    id: "gold-lounge",
    title: "Fairmont Gold Lounge",
    subtitle: "EXCLUSIVE RETREAT",
    description:
      "Step into a world of refined luxury. The Fairmont Gold Lounge is your private sanctuary — offering all-day dining, complimentary refreshments, and dedicated Gold hosts to curate every detail of your stay.",
    image: `${ASSET}/wplzju3p_WhatsApp%20Image%202026-03-24%20at%2015.01.42.jpeg`,
    tag: "Private Lounge Access",
  },
  {
    id: "gold-rooms",
    title: "Gold Floor Rooms & Suites",
    subtitle: "ELEVATED LIVING",
    description:
      "Reside on the distinguished Gold Floor, where panoramic city views meet impeccable interiors. Each room and suite is thoughtfully appointed with premium amenities, bespoke furnishings, and personalized turn-down service.",
    image: `${ASSET}/6rfb89f4_b354_ho_01_p_1024x768.jpg`,
    tag: "Premium Accommodations",
  },
  {
    id: "signature-events",
    title: "Signature Event Spaces",
    subtitle: "GRAND CELEBRATIONS",
    description:
      "From intimate gatherings to grand celebrations, our signature event spaces are designed to leave lasting impressions. Let our event architects transform your vision into an extraordinary experience with world-class staging and décor.",
    image: `${ASSET}/j2xc080s_gemini-2.5-flash-image_create_the_bottom_view_of_the_venue_and_the_observer_is_on_the_top_seeing_the_bo-0.jpg`,
    tag: "Event Excellence",
  },
  {
    id: "personalized-services",
    title: "Personalized Concierge",
    subtitle: "BESPOKE EXPERIENCES",
    description:
      "Our dedicated Gold Concierge team is at your service around the clock. From curating exclusive dining experiences to arranging private tours and tailored wedding journeys, every request is handled with the utmost care and discretion.",
    image: `${ASSET}/f1puz5nl_Gemini_Generated_Image_f1jis2f1jis2f1ji.png`,
    tag: "24/7 Dedicated Service",
  },
];

export default function ConciergePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white" data-testid="concierge-page">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="glass-button rounded-full px-4 py-2 flex items-center gap-2 text-sm"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            data-testid="concierge-back"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={FAIRMONT_LOGO}
              alt="Fairmont"
              className="h-7 brightness-0 invert opacity-70"
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className="w-20" />
        </div>

        {/* Hero */}
        <div className="px-6 pt-8 pb-14 text-center max-w-3xl mx-auto">
          <p
            className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
          >
            Fairmont Gold
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-5 text-white"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
          >
            Concierge Services
          </h2>
          <p
            className="text-white/60 text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Experience an unparalleled level of personalized luxury. Our Gold Concierge team crafts
            bespoke moments for every guest — from arrival to departure and beyond.
          </p>
        </div>

        {/* Four Sections Grid */}
        <div className="px-6 pb-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONCIERGE_SECTIONS.map((section, index) => (
            <div
              key={section.id}
              className="glass-panel rounded-2xl overflow-hidden group transition-all duration-500 hover:border-white/30 hover:bg-white/10 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.12}s`, animationFillMode: "forwards" }}
              data-testid={`concierge-section-${section.id}`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
                {/* Tag badge */}
                <span
                  className="absolute top-4 left-4 glass-button rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-white/80"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  {section.tag}
                </span>
              </div>

              {/* Text */}
              <div className="p-6">
                <p
                  className="text-white/40 text-[10px] uppercase tracking-[0.25em] mb-1"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  {section.subtitle}
                </p>
                <h3
                  className="text-white text-xl mb-3"
                  style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
                >
                  {section.title}
                </h3>
                <p
                  className="text-white/55 text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer branding */}
        <div className="pb-10 text-center">
          <p
            className="text-white/25 text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Fairmont Gold · The Art of Luxury
          </p>
        </div>
      </div>
    </div>
  );
}
