type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
	React.RefAttributes<SVGSVGElement>;

type IconProps = HeroIconSVGProps & {
	title?: string;
	titleId?: string;
};

export type Heroicon = React.FC<IconProps>;

export type EventOrValue = React.ChangeEvent<HTMLInputElement> | string | number;

export enum FormActionEnum {
	Add = 0,
	Update = 1,
	Delete = 2
}

export enum SortEnum {
  dateAsc,
  dateDesc,
  nameAsc,
  nameDesc,
  sitesAsc,
  sitesDesc
}

export enum ViewCollectionsEnum {
  List,
  Card,
  Moodboard
}

export enum ShowInBookmarkEnum {
  Cover,
  Title,
  Description,
  BookmarkInfo
}
