import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Globe,
  MapPin,
  Calendar,
  CheckCircle2,
  Building2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useGetGiftDetailsQuery } from "@/lib/redux/apis/giftApi";

interface GiftDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  giftId: number | null;
}

const InfoCell = ({
  icon: Icon,
  label,
  value,
  valueClassName,
  isLink = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
  isLink?: boolean;
}) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-2.5">
    <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
    </div>
    <div>
      <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-semibold text-brand-500 leading-tight flex items-center gap-1 hover:underline"
        >
          View Link <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <p
          className={`text-[12px] font-semibold text-gray-800 leading-tight ${valueClassName ?? ""}`}
        >
          {value || "N/A"}
        </p>
      )}
    </div>
  </div>
);

export function GiftDetailModal({
  isOpen,
  onOpenChange,
  giftId,
}: GiftDetailModalProps) {
  const { data: response, isLoading } = useGetGiftDetailsQuery(giftId!, { skip: !isOpen || !giftId });
  const data = response?.data;
  const [expanded, setExpanded] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl p-2 gap-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : data ? (
          <>
            {/* Hero */}
            <div className="relative h-44 overflow-hidden bg-brand-50 rounded-2xl">
              <img
                src={data.image_url || "/assets/placeholder.png"}
                alt={data.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-brand-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow">
                Gift
              </span>
            </div>

            {/* Body */}
            <div className="px-5 pt-4 pb-5 space-y-4 bg-white overflow-y-auto max-h-[70vh]">
              {/* Title row */}
              <h2 className="text-[18px] font-bold text-gray-900 leading-snug">
                {data.name}
              </h2>

              {/* Description */}
              {data.description && (
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 mb-1.5">
                    Description
                  </p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {expanded || data.description.length <= 130 ? data.description : `${data.description.slice(0, 130)}...`}
                    {data.description.length > 130 && (
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-brand-400 font-medium text-[12px] hover:underline ml-1"
                      >
                        {expanded ? "Read less" : "Read more"}
                      </button>
                    )}
                  </p>
                </div>
              )}

              {/* Includes */}
              {data.includes && data.includes.length > 0 && (
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 mb-2">
                    Includes
                  </p>
                  <div className="space-y-2">
                    {data.includes.map((item: string, i: number) => (
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
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                <InfoCell icon={Globe} label="Website" value={data.website || ""} isLink />
                <InfoCell icon={MapPin} label="Location" value={data.location || ""} />
                <InfoCell icon={Calendar} label="Date Added" value={data.date_added || ""} />
                <InfoCell icon={Building2} label="Created by" value={data.created_by || ""} valueClassName="italic" />
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
