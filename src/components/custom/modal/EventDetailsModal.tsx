import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Globe,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";

interface EventDetail {
  id: number;
  name: string;
  image_url: string | null;
  description: string;
  website: string | null;
  location: string;
  created_by: string;
  status: string;
  date_added: string;
  whatsapp: string | null;
  date: string;
  time: string;
  tags: string[];
}

interface EventDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number | null;
}

const InfoCell = ({
  icon: Icon,
  label,
  value,
  valueClass = "",
  isLink = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
  isLink?: boolean;
}) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-[11px] font-medium text-brand-500 leading-tight flex items-center gap-1 ${valueClass}`}
      >
        View Link <ExternalLink className="w-3 h-3" />
      </a>
    ) : (
      <p
        className={`text-[11px] font-medium text-gray-800 leading-tight ${valueClass}`}
      >
        {value || "N/A"}
      </p>
    )}
  </div>
);

export function EventDetailsModal({
  isOpen,
  onOpenChange,
  eventId,
}: EventDetailModalProps) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!eventId || !accessToken) return;
      setIsLoading(true);
      try {
        const response = await fetch(`http://10.10.12.60:8015/api/v1/admin/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();
        if (result.status === "success") {
          setData(result.data);
        } else {
          toast.error(result.message || "Failed to fetch event details");
        }
      } catch (error) {
        console.error("Fetch event details error:", error);
        toast.error("An error occurred while fetching event details");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && eventId) {
      fetchDetails();
    }
  }, [isOpen, eventId, accessToken]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-2 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        showCloseButton={true}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : data ? (
          <>
            {/* Hero Image */}
            <div className="relative h-40 overflow-hidden rounded-xl">
              <img
                src={data.image_url || "/assets/placeholder.png"}
                alt={data.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 right-2.5 bg-brand-500 text-white text-[11px] font-medium px-3 py-1 rounded-full">
                Event
              </span>
            </div>

            {/* Body */}
            <div className="px-4 pt-3 pb-4 space-y-3 overflow-y-auto max-h-[70vh]">
              {/* Title row */}
              <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                {data.name}
              </h2>

              {/* Description */}
              <div>
                <p className="text-[11px] font-semibold text-gray-800 mb-1">
                  Description
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {isExpanded
                    ? data.description
                    : `${data.description.slice(0, 120)}...`}{" "}
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
                <InfoCell icon={Globe} label="Website" value={data.website || ""} isLink />
                <InfoCell icon={MapPin} label="Location" value={data.location} />
                <InfoCell icon={Calendar} label="Date" value={data.date} />
                <InfoCell icon={MessageCircle} label="Whatsapp" value={data.whatsapp || ""} isLink />
                <div className="col-span-2">
                  <InfoCell icon={Clock} label="Time" value={data.time} />
                </div>
              </div>

              {/* Tags */}
              {data.tags && data.tags.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-800 mb-2">
                    Tag
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        className="bg-brand-100 text-brand-600 border-0 rounded-full text-[10px] px-3 py-1 font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
