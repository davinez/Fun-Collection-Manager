import {
	useFetch,
	useLoadMore,
	usePrefetch,
	useUpdate,
} from "@/api/reactQueryGenerics";
import type {
	AppointmentInterface,
	CarDetailInterface,
	InsuranceDetailsInterface,
} from "../interfaces/appointments";

const API_URL = "http://localhost:8080/api";

export const useGetAppointmentsList = () =>
	useLoadMore<Array<AppointmentInterface>>(API_URL + "/signup");

export const useGetAppointment = (id: number) =>
	useFetch<AppointmentInterface>(pathToUrl(apiRoutes.appointment, { id }));

export const usePatchAppointment = (id: number) =>
	useUpdate<AppointmentInterface, AppointmentInterface>(
		pathToUrl(apiRoutes.appointment, { id })
	);

export const useGetCarDetail = (id: number | null) =>
	useFetch<CarDetailInterface>(
		pathToUrl(apiRoutes.getCarDetail, { id }),
		undefined,
		{ staleTime: 2000 }
	);

export const useGetInsurance = (id: number | null) =>
	useFetch<InsuranceDetailsInterface>(
		id ? pathToUrl(apiRoutes.getInsurance, { id }) : null
	);

export const usePrefetchCarDetails = (id: number | null) =>
	usePrefetch<InsuranceDetailsInterface>(
		id ? pathToUrl(apiRoutes.getCarDetail, { id }) : null
	);
