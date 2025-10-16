/** Media Items */

type MediaMetadata = {
  palette?: string[] | null;
  dominantColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  aspectRatioType: string | null;
  aspectRatio: number | null;
  platform: string | null;
  platformId: string | null;
  platformUrl: string | null;
  keywords: string[] | null;
  artStyle: string[] | null;
  audienceKeywords: string[] | null;
  mediaType: string | null;
  mimeType: string | null;
  userTags: string[] | null;
};

type ImageSet = {
  src: string;
  type?: string;
  originalSrc?: string;
  size?: string;
  srcHeight?: number;
  srcWidth?: number;
  title?: string;
  description?: string;
  url?: string;
  imagePageUrl?: string;
  pageUrl?: string;
  set?: {
    src: string;
    originalSrc?: string;
    size?: string;
    srcHeight?: number;
    srcWidth?: number;
  }[];
  metadata?: MediaMetadata;
};

type VideoSet = {
  src: string;
  creator?: string;
  duration?: string;
  views?: number;
  placeholder?: string;
  height?: number;
  width?: number;
};

/** MediaGrid */

type MediaGrid = {
  sources: (
    | {
        type: 'image';
        image: ImageSet;
        video?: never;
      }
    | {
        type: 'video';
        video: VideoSet;
        image?: never;
      }
  )[];
};

/** InfoTable */
type InfoTable = {
  columns: {
    name: string;
    value: string;
  }[];
};

/** DataTable */

export type HoverCard = {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: ImageSet;
  imageClassName?: string;
  imageStyle?: any;
  footerItems: DataTableCell[];
};

export type MixedCell = {
  type: 'mixed';
  tag?: 'div';
  className?: string;
  style?: any;
  items: DataTableCell[];
};

export type CellText = {
  type: 'text';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  value: string;
  className?: string;
  hoverCard?: HoverCard;
  style?: any;
};

export type CellAvatar = {
  type: 'avatar';
  img?: ImageSet;
  imgClassName?: string;
  imgStyle?: any;
  bgClassName?: string;
  bgStyle?: any;
};

export type CellButton = {
  type: 'button';
  label: string;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  actionId?: string;
  style?: any;
  items?: DataTableCell[];
};

export type CellBadge = {
  type: 'badge';
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: any;
  className?: string;
};

export type CellLink = {
  type: 'link';
  href?: string;
  text: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: 'noopener noreferrer' | 'nofollow' | 'noreferrer' | 'noopener';
  className?: string;
  style?: any;
  items?: DataTableCell[];
};

export type CellImage = {
  type: 'image';
  className?: string;
  img?: ImageSet;
  openDialog?: boolean;
  style?: any;
};

export type DataTableCell =
  | MixedCell
  | CellText
  | CellButton
  | CellBadge
  | CellAvatar
  | CellLink
  | CellImage;
export type DataTableRow = {
  className?: string;
  style?: any;
  items: { cell: DataTableCell; className?: string; style?: any }[];
};

export type DataTable = {
  title?: string;
  caption?: string;
  description?: string;
  style?: any;
  rows: DataTableRow[];
};

export type UiCommonTypes = {
  MediaGrid: MediaGrid;
  InfoTable: InfoTable;
  ImageSet: ImageSet;
  VideoSet: VideoSet;
  DataTable: DataTable;
};
