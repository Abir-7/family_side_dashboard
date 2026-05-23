import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Tag as TagIcon,
  Gift,
  CheckCircle2,
  Building2,
} from "lucide-react";

interface GiftDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gift?: {
    name?: string;
    distance?: string;
    description?: string;
    website?: string;
    location?: string;
    price?: string;
    date?: string;
    whatsapp?: string;
    tags?: string[];
    offeredBy?: string;
    heroImage?: string;
    includes?: string[];
  };
  onBlock?: () => void;
  onCancel?: () => void;
}

const InfoCell = ({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-2.5">
    <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
    </div>
    <div>
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p
        className={`text-[12px] font-semibold text-gray-800 leading-tight ${valueClassName ?? ""}`}
      >
        {value}
      </p>
    </div>
  </div>
);

export function GiftDetailModal({
  isOpen,
  onOpenChange,
  gift = {},
  onBlock,
  onCancel,
}: GiftDetailModalProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    name = "Birthday Gift Set",
    distance = "1.7 km",
    description = "A perfectly curated birthday gift set for kids, featuring educational toys and fun art supplies. Ideal for ages 3–8 years. Each item is carefully selected to encourage creativity, learning, and imaginative play.",
    website = "www.giftshop.com",
    location = "321 Arts Boulevard",
    price = "$45.00",
    date = "16 April 2026",
    whatsapp = "09839922",
    offeredBy = "IPSUM",
    heroImage = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=300&fit=crop",
    tags = ["Toys", "Educational", "Kids"],
    includes = [
      "Gift wrapping included",
      "Personalised message card",
      "Free delivery over $50",
    ],
  } = gift;

  const shortDesc = description.slice(0, 130);
  const isLong = description.length > 130;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl p-2 gap-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        {/* Hero */}
        <div className="relative h-44 overflow-hidden bg-brand-50">
          {heroImage ? (
            <img
              src={heroImage}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-2xl">
              <Gift className="w-16 h-16 text-brand-200" />
            </div>
          )}
          <span className="absolute top-3 right-3 bg-brand-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow">
            Gift
          </span>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 space-y-4 bg-white overflow-y-auto max-h-[70vh]">
          {/* Title + distance */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[18px] font-bold text-gray-900 leading-snug">
              {name}
            </h2>
            <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap mt-1 shrink-0">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-[13px] font-semibold text-gray-900 mb-1.5">
              Description
            </p>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              {expanded || !isLong ? description : shortDesc}
              {isLong && !expanded && (
                <>
                  {"... "}
                  <button
                    onClick={() => setExpanded(true)}
                    className="text-brand-400 font-medium text-[12px] hover:underline"
                  >
                    Read more
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Includes */}
          <div>
            <p className="text-[13px] font-semibold text-gray-900 mb-2">
              Includes
            </p>
            <div className="space-y-2">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="w-5 h-5 shrink-0"
                    style={{ color: "white", fill: "#22c55e" }}
                  />
                  <span className="text-[12.5px] text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            <InfoCell icon={DollarSign} label="Price" value={price} />
            <InfoCell icon={Calendar} label="Date" value={date} />
            <InfoCell icon={Globe} label="Website" value={website} />
            <InfoCell icon={MapPin} label="Location" value={location} />
            <InfoCell icon={MessageCircle} label="Whatsapp" value={whatsapp} />
            <InfoCell
              icon={Building2}
              label="Offered by"
              value={offeredBy}
              valueClassName="font-black italic tracking-tight"
            />
          </div>

          {/* Tags */}
          <div>
            <p className="text-[13px] font-semibold text-gray-900 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 rounded-full text-[10px] px-3 py-1 font-medium"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onBlock}
              className="py-3.5 rounded-2xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Block
            </button>
            <button
              onClick={onCancel ?? (() => onOpenChange(false))}
              className="py-3.5 rounded-2xl bg-brand-400 text-[13px] font-semibold text-white hover:bg-brand-500 transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
