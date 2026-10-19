import { timeslotApi } from "@/api/timeslotApi";
import { useQuery } from "@tanstack/react-query";

export function useTimeslots(){
    return useQuery({
        queryKey: ["timeslot"],
        queryFn: timeslotApi.getAll,
    });
}