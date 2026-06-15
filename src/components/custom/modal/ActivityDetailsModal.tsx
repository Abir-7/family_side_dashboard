import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Globe,
  PenLine,
  Home,
  Calendar,
  MessageCircle,
  Clock,
  Loader2,
  ExternalLink,
  User as UserIcon,
} from "lucide-react";
import { useGetActivityDetailsQuery } from "@/lib/redux/apis/activityApi";

interface ActivityDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: number | null;
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

export function ActivityDetailsModal({
  isOpen,
  onOpenChange,
  activityId,
}: ActivityDetailModalProps) {
  const { data: response, isLoading } = useGetActivityDetailsQuery(activityId!, { skip: !isOpen || !activityId });
  const data = response?.data;
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-2 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        showCloseButton={true}
      >
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <UserIcon className="w-4 h-4 text-gray-500" />
            Activity Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : data ? (
          <div className="px-4 pb-4 space-y-3 overflow-y-auto max-h-[70vh]">
            <div className="relative h-40 overflow-hidden rounded-xl">
              <img
                src={data.image_url || "/assets/placeholder.png"}
                alt={data.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 right-2.5 bg-brand-500 text-white text-[11px] font-medium px-3 py-1 rounded-full">
                Activity
              </span>
            </div>

            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              {data.name}
            </h2>

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

            <div className="grid grid-cols-2 gap-2">
              <InfoCell icon={Globe} label="Website" value={data.website || ""} isLink />
              <InfoCell icon={Home} label="Location" value={data.location} />
              <InfoCell icon={PenLine} label="Created by" value={data.created_by} />
              <InfoCell
                icon={Home}
                label="Status"
                value={data.status}
                valueClass="!text-green-600"
              />
              <InfoCell icon={Calendar} label="Date Added" value={data.date_added} />
              <InfoCell icon={MessageCircle} label="Whatsapp" value={data.whatsapp || ""} isLink />
            </div>
            
             {/* Time */}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                <p className="text-[11px] font-medium text-gray-800">
                  {data.opening_days} - {data.opening_hours}
                </p>
              </div>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-800 mb-2">
                    Tag
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.tags.map((tag: string, i: number) => (
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
}