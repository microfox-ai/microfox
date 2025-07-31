export interface FontStyle {
  name: string;
  style: 'normal' | 'italic';
  weight: number;
  filename: string;
  post_script_name: string;
  full_name: string;
  copyright: string;
}

export interface FontAxis {
  tag: string;
  min_value: number;
  max_value: number;
}

export interface FontSourceFile {
  source_file: string;
  dest_file: string;
}

export interface FontSource {
  repository_url: string;
  commit: string;
  archive_url: string;
  files: FontSourceFile[];
  branch: string;
}

export interface FontData {
  name: string;
  designer: string;
  license: string;
  category: string;
  date_added: string;
  description: string;
  fonts: FontStyle[];
  subsets: string[];
  axes: FontAxis[];
  source: FontSource;
  tags?: string[];
  designer_bio?: string;
  lang?: any;
}
