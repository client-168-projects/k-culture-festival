export type NoticeAttachment = {
  id: number;
  notice_id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  is_pinned: number;
  created_at: string;
  updated_at: string;
  attachments: NoticeAttachment[];
};
