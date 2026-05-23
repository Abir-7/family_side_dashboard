import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, MapPin, Calendar, Clock } from "lucide-react";

interface EventDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event?: {
    title?: string;
    distance?: string;
    description?: string;
    website?: string;
    location?: string;
    date?: string;
    time?: string;
    heroImage?: string;
  };
  onBlock?: () => void;
  onCancel?: () => void;
}

const InfoCell = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="border border-gray-100 rounded-2xl p-3 flex flex-col gap-1.5">
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
    <p className="text-[12px] font-semibold text-gray-800 leading-tight pl-0.5">
      {value}
    </p>
  </div>
);

export function EventDetailsModal({
  isOpen,
  onOpenChange,
  event = {},
  onBlock,
  onCancel,
}: EventDetailModalProps) {
  const {
    title = "Little Stars Pediatric Clinic",
    distance = "1.7 km",
    description = "Welcome to Adventure Play Center, where children can explore, learn, and have fun in a safe and engaging environment. Our facility offers a wide range of activities designed to promote physical development, creativity, and social skills.",
    website = "www.familyside.com",
    location = "321 Arts Boulevard......",
    date = "16 April 2026",
    time = "07:00 AM to 09:00 PM",
    heroImage,
  } = event;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-2 gap-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
        showCloseButton={false}
      >
        {/* Hero Image */}
        <div className="relative h-44 overflow-hidden rounded-2xl">
          {heroImage ? (
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            /* Fallback illustrated park scene */
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 380 176"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 rounded-2xl"
              preserveAspectRatio="xMidYMid slice"
            >
              <rect width="380" height="176" fill="#4a7c45" />
              {/* Sky */}
              <rect width="380" height="100" fill="#b8d4a8" opacity="0.6" />
              {/* Path */}
              <path
                d="M160,176 Q190,100 220,176"
                fill="#c8b87a"
                opacity="0.7"
              />
              <path
                d="M165,176 Q190,108 215,176"
                fill="#d4c484"
                opacity="0.5"
              />
              {/* Left trees */}
              <rect x="20" y="60" width="14" height="116" fill="#3a2a1a" />
              <ellipse
                cx="27"
                cy="55"
                rx="38"
                ry="52"
                fill="#2d5e28"
                opacity="0.9"
              />
              <ellipse
                cx="27"
                cy="40"
                rx="30"
                ry="42"
                fill="#4a8a3a"
                opacity="0.85"
              />
              <rect x="75" y="75" width="12" height="101" fill="#3a2a1a" />
              <ellipse
                cx="81"
                cy="68"
                rx="32"
                ry="46"
                fill="#336628"
                opacity="0.88"
              />
              <ellipse
                cx="81"
                cy="55"
                rx="26"
                ry="36"
                fill="#5a9a48"
                opacity="0.8"
              />
              {/* Right trees */}
              <rect x="310" y="55" width="14" height="121" fill="#3a2a1a" />
              <ellipse
                cx="317"
                cy="50"
                rx="40"
                ry="54"
                fill="#2d5e28"
                opacity="0.9"
              />
              <ellipse
                cx="317"
                cy="36"
                rx="32"
                ry="44"
                fill="#4a8a3a"
                opacity="0.85"
              />
              <rect x="350" y="70" width="12" height="106" fill="#3a2a1a" />
              <ellipse
                cx="356"
                cy="64"
                rx="30"
                ry="44"
                fill="#336628"
                opacity="0.88"
              />
              <ellipse
                cx="356"
                cy="52"
                rx="24"
                ry="34"
                fill="#5a9a48"
                opacity="0.8"
              />
              {/* Mid trees */}
              <rect x="135" y="85" width="8" height="91" fill="#3a2a1a" />
              <ellipse
                cx="139"
                cy="80"
                rx="22"
                ry="32"
                fill="#2a5a24"
                opacity="0.85"
              />
              <rect x="232" y="82" width="8" height="94" fill="#3a2a1a" />
              <ellipse
                cx="236"
                cy="76"
                rx="22"
                ry="32"
                fill="#2a5a24"
                opacity="0.85"
              />
              {/* Ground */}
              <path
                d="M0,148 Q95,128 190,138 Q285,148 380,130 L380,176 L0,176 Z"
                fill="#5a9e4a"
                opacity="0.6"
              />
              <path
                d="M0,160 Q95,144 190,152 Q285,160 380,145 L380,176 L0,176 Z"
                fill="#4a8a3a"
                opacity="0.55"
              />
            </svg>
          )}
          {/* Event badge */}
          <span className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-semibold px-3.5 py-1 rounded-full shadow">
            Event
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 bg-white rounded-b-3xl">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[17px] font-bold text-gray-900 leading-snug">
              {title}
            </h2>
            <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap mt-0.5 shrink-0">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-[12px] font-semibold text-gray-900 mb-1">
              Description
            </p>
            <p className="text-[11.5px] text-gray-500 leading-relaxed">
              {description}{" "}
              <span className="text-rose-500 cursor-pointer font-medium underline underline-offset-2">
                Read more
              </span>
            </p>
          </div>

          {/* Info grid — 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            <InfoCell icon={Globe} label="Website" value={website} />
            <InfoCell icon={Calendar} label="Date" value={date} />
            <InfoCell icon={MapPin} label="Location" value={location} />
            <InfoCell icon={Clock} label="Time" value={time} />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onBlock}
              className="py-3 rounded-2xl border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Block
            </button>
            <button
              onClick={onCancel ?? (() => onOpenChange(false))}
              className="py-3 rounded-2xl bg-rose-500 text-[13px] font-semibold text-white hover:bg-rose-600 transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
