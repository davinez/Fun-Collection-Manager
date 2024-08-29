import type { FunctionComponent } from "shared/types/global.types";
import { useState } from "react";

type TProduct = {
	category: string;
	price: string;
	stocked: boolean;
	name: string;
};

type TProductCategoryRowProps = {
	category: string | undefined;
};

type TProductRowProps = {
	product: TProduct;
};

type TProductTableProps = {
	products: Array<TProduct>;
	filterText: string;
	inStockOnly: boolean;
};

type TFilterableProductTableProps = {
	products: Array<TProduct>;
};

type TSearchBarProps = {
	filterText: string;
	inStockOnly: boolean;
	onFilterTextChange: React.Dispatch<React.SetStateAction<string>>;
	onInStockOnlyChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductCategoryRow = ({
	category,
}: TProductCategoryRowProps): FunctionComponent => {
	return (
		<tr>
			<th colSpan={2}>{category}</th>
		</tr>
	);
};

const ProductRow = ({ product }: TProductRowProps): FunctionComponent => {
	const name = product.stocked ? (
		product.name
	) : (
		<span style={{ color: "red" }}>{product.name}</span>
	);

	return (
		<tr>
			<td>{name}</td>
			<td>{product.price}</td>
		</tr>
	);
};

const ProductTable = ({
	products,
	filterText,
	inStockOnly,
}: TProductTableProps): FunctionComponent => {
	const rows: Array<FunctionComponent> = [];

	let lastCategory: string | null = null;

	products.forEach((product) => {
		if (!product.name.toLowerCase().includes(filterText.toLowerCase())) {
			return;
		}
		if (inStockOnly && !product.stocked) {
			return;
		}
		if (product.category !== lastCategory) {
			rows.push(
				<ProductCategoryRow
					category={product.category}
					key={product.category}
				/>
			);
		}
		rows.push(<ProductRow product={product} key={product.name} />);
		lastCategory = product.category;
	});

	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
};

const SearchBar = ({
	filterText,
	inStockOnly,
	onFilterTextChange,
	onInStockOnlyChange,
}: TSearchBarProps): FunctionComponent => {
	return (
		<form>
			<input
				type="text"
				value={filterText}
				placeholder="Search..."
				onChange={(event): void => {
					onFilterTextChange(event.target.value);
				}}
			/>
			<label>
				<input
					type="checkbox"
					checked={inStockOnly}
					onChange={(event): void => {
						onInStockOnlyChange(event.target.checked);
					}}
				/>{" "}
				Only show products in stock
			</label>
		</form>
	);
};

export const FilterableProductTable = ({
	products,
}: TFilterableProductTableProps): FunctionComponent => {
	const [filterText, setFilterText] = useState("");
	const [inStockOnly, setInStockOnly] = useState(false);

	return (
		<div>
			<SearchBar
				filterText={filterText}
				inStockOnly={inStockOnly}
				onFilterTextChange={setFilterText}
				onInStockOnlyChange={setInStockOnly}
			/>
			<ProductTable
				products={products}
				filterText={filterText}
				inStockOnly={inStockOnly}
			/>
		</div>
	);
};
