type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
  React.RefAttributes<SVGSVGElement>;

type IconProps = HeroIconSVGProps & {
  title?: string;
  titleId?: string;
};

export type Heroicon = React.FC<IconProps>;

export type EventOrValue = React.ChangeEvent<HTMLInputElement> | string | number;

export type TBreakpointsStyling = {
  sm: string;
  md: string;
  lg: string;
}

export enum FormActionEnum {
  Add = 0,
  Update = 1,
  Delete = 2
}

export enum CollectionModalActionEnum {
  Delete = 0,
  Icon = 1
}

export enum SortEnum {
  DateAsc = 'dateAsc',
  DateDesc = 'dateDesc',
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
  SitesAsc = 'sitesAsc',
  SitesDesc = 'sitesDesc'
}

export enum ViewCollectionsEnum {
  List = 'list',
  Card = 'card',
  Moodboard = 'moodboard'
}

export enum ShowInBookmarkEnum {
  Cover = 'cover',
  Title = 'title',
  Description = 'description',
  BookmarkInfo = 'bookmarkInfo'
}

export enum FilterBookmarksEnum {
  Info = 'info',
  CreationDate = 'creationDate',
  URL = 'url'
}


