import { useQuery } from "@tanstack/react-query";
import { stationApi } from "@/api/stationApi";

export function useStations(){
    return useQuery({
        queryKey: ["station"],
        queryFn: stationApi.getAll,
    });
}