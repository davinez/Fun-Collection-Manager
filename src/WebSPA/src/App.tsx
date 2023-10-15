import type { FunctionComponent } from "shared/types/global.types";
import {
	TicTacToe,
	FilterableProductTable,
} from "components/ui/examples/index";
import PRODUCTS from "@/data/mock/products.json";

export const App = (): FunctionComponent => {
	return (
		<>
			<TicTacToe />
			<FilterableProductTable products={PRODUCTS} />
		</>
	);
};
