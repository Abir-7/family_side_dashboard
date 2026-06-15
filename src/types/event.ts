export interface Event {
  id: number;
  name: string;
  image_url: string | null;
  created_by: string;
  category: string;
  location: string;
  fee: number;
}

export interface EventsResponse {
  data: {
    items: Event[];
    total: number;
  };
}

export interface EventDetailResponse {
  data: Event;
}
