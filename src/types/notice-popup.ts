export type PopupSize = "small" | "medium" | "large";

export type NoticePopup = {
  id: number;
  image_url: string;
  target_url: string | null;
  hide_duration_days: number;
  start_date: string;
  end_date: string;
  priority: number;
  is_hidden: number;
  size: PopupSize;
  created_at: string;
  updated_at: string;
};

export type PopupStatus = "scheduled" | "active" | "ended" | "hidden";
