import { Suspense } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
import { isNumber } from "@/shared/utils";

export const CollectionPageParams = (): React.ReactElement => {
	// Get the Collection Id param from the URL.
	const { collectionId } = useParams();

	if (!collectionId || !isNumber(collectionId)) {
		return <Navigate to="/my/manager/dashboard" />;
	}

	return (
		<Suspense fallback={<CircularProgress isIndeterminate color="green.300" />}>
			<Outlet />
		</Suspense>
	);
};
