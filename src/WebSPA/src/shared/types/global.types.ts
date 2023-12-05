type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
	React.RefAttributes<SVGSVGElement>;

type IconProps = HeroIconSVGProps & {
	title?: string;
	titleId?: string;
};

export type Heroicon = React.FC<IconProps>;


type TDynamicCollapseStateSettings = {
   id: number,
	 open: boolean
} 

export type TDynamicCollapseState = {
	settings: TDynamicCollapseStateSettings[]; 
};

