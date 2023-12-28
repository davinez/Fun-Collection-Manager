type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
	React.RefAttributes<SVGSVGElement>;

type IconProps = HeroIconSVGProps & {
	title?: string;
	titleId?: string;
};

export type Heroicon = React.FC<IconProps>;

export enum ReusableFormActionEnum {
	Add = 0,
	Update = 1,
	Delete = 2
}
