import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Globe,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    whatsapp?: string;
    createdBy?: string;
    status?: string;
    tags?: string[];
    heroImage?: string;
  };
  onBlock?: () => void;
  onCancel?: () => void;
}

const InfoCell = ({
  icon: Icon,
  label,
  value,
  valueClass = "",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
    <p
      className={`text-[11px] font-medium text-gray-800 leading-tight ${valueClass}`}
    >
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
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    title = "Family Yoga Day",
    distance = "1.7 km",
    description = "Welcome to Adventure Play Center, where children can explore, learn, and have fun in a safe and engaging environment. Our facility offers a wide range of activities designed to promote physical development, creativity, and social skills.",
    website = "www.familyside.com",
    location = "321 Arts Boulevard, Creative District",
    date = "16 April 2026",
    time = "07:00 AM to 09:00 PM",
    whatsapp = "09839922",
    tags = ["Health", "Yoga", "Family", "Outdoor", "Wellness"],
    heroImage,
  } = event;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-2 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        showCloseButton={false}
      >
        {/* Hero Image */}
        <div className="relative h-40 overflow-hidden rounded-xl">
          {heroImage ? (
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 380 160"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 rounded-xl"
              preserveAspectRatio="xMidYMid slice"
            >
              <rect width="380" height="160" fill="#3d7a4a" />
              <ellipse
                cx="60"
                cy="90"
                rx="55"
                ry="75"
                fill="#2d5e38"
                opacity="0.85"
              />
              <ellipse
                cx="60"
                cy="55"
                rx="45"
                ry="58"
                fill="#4a8a5a"
                opacity="0.9"
              />
              <rect x="55" y="118" width="10" height="42" fill="#2a4a30" />
              <ellipse
                cx="140"
                cy="80"
                rx="50"
                ry="68"
                fill="#2d6040"
                opacity="0.75"
              />
              <ellipse
                cx="140"
                cy="50"
                rx="42"
                ry="54"
                fill="#5a9e6a"
                opacity="0.88"
              />
              <rect x="135" y="118" width="9" height="42" fill="#2a4a30" />
              <ellipse
                cx="260"
                cy="85"
                rx="58"
                ry="78"
                fill="#2a5a38"
                opacity="0.8"
              />
              <ellipse
                cx="260"
                cy="52"
                rx="48"
                ry="62"
                fill="#4a8a58"
                opacity="0.92"
              />
              <rect x="255" y="122" width="10" height="38" fill="#2a4a30" />
              <ellipse
                cx="340"
                cy="90"
                rx="46"
                ry="65"
                fill="#336845"
                opacity="0.82"
              />
              <ellipse
                cx="340"
                cy="60"
                rx="38"
                ry="50"
                fill="#5aaa6a"
                opacity="0.9"
              />
              <rect x="336" y="122" width="8" height="38" fill="#2a4a30" />
              <path
                d="M140,160 Q190,118 240,160"
                fill="#8aaf7a"
                opacity="0.5"
              />
              <path
                d="M0,148 Q95,112 190,132 Q285,150 380,130 L380,160 L0,160 Z"
                fill="#5a9e4a"
                opacity="0.55"
              />
            </svg>
          )}
          {/* Event badge */}
          <span className="absolute top-2.5 right-2.5 bg-brand-500 text-white text-[11px] font-medium px-3 py-1 rounded-full">
            Event
          </span>
        </div>

        {/* Body */}
        <div className="px-4 pt-3 pb-4 space-y-3 overflow-y-auto max-h-[70vh]">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              {title}
            </h2>
            <span className="flex items-center gap-1 text-[11px] text-gray-500 whitespace-nowrap mt-0.5 shrink-0">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-semibold text-gray-800 mb-1">
              Description
            </p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {isExpanded ? description : `${description.slice(0, 120)}...`}{" "}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2">
            <InfoCell icon={Globe} label="Website" value={website} />
            <InfoCell icon={MapPin} label="Location" value={location} />
            <InfoCell icon={Calendar} label="Date" value={date} />
            <InfoCell icon={MessageCircle} label="Whatsapp" value={whatsapp} />
            <div className="col-span-2">
              <InfoCell icon={Clock} label="Time" value={time} />
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-800 mb-2">
                Tag
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    className="bg-brand-400 text-white border-0 rounded-full text-[10px] px-3 py-1 font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onBlock}
              className="py-3 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Block
            </button>
            <button
              onClick={onCancel ?? (() => onOpenChange(false))}
              className="py-3 rounded-xl bg-brand-500 text-[13px] font-medium text-white hover:bg-brand-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
