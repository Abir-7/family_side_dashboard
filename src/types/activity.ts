export interface Activity {
  id: number;
  name: string;
  image_url: string | null;
  created_by: string;
  category: string;
  location: string;
  fee: number;
  description?: string;
  website?: string;
  status?: string;
  date_added?: string;
  whatsapp?: string;
  opening_days?: string;
  opening_hours?: string;
  tags?: string[];
}

export interface ActivitiesResponse {
  data: {
    items: Activity[];
    total: number;
  };
}

export interface ActivityDetailResponse {
  data: Activity;
}
