package dev.ach.dienstplanung.service;


import ai.timefold.solver.core.api.solver.SolutionManager;
import ai.timefold.solver.core.api.solver.SolverManager;
import ai.timefold.solver.core.api.solver.SolverStatus;
import dev.ach.dienstplanung.dto.ScheduleResponse;
import dev.ach.dienstplanung.planning.Schedule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class DienstPlanningsService {

    private final SolverManager<Schedule> solverManager;
    private final SolutionManager<Schedule, ?> solutionManager;
    private final ScheduleService scheduleService;
    private final ScheduleWriterService scheduleWriterService;

    private final Map<UUID, Schedule> scheduleMap = new ConcurrentHashMap<>();

    public UUID solve(){
        Schedule problem = scheduleService.load();
        UUID jobId= UUID.randomUUID();
        scheduleMap.put(jobId, problem);

        assert solverManager != null;
        solverManager.solveBuilder()
                .withProblemId(jobId)
                .withProblemFinder(id-> scheduleMap.get(id))
                .withBestSolutionEventConsumer(event ->{
                    Schedule bestSolution = event.solution();
                    scheduleMap.put(jobId, bestSolution);
                    scheduleWriterService.writeBack(bestSolution);

                })
                .run();

        return  jobId;
    }

    public ScheduleResponse getSchedule(UUID jobId){
        Schedule schedule = scheduleMap.get(jobId);

        if (schedule == null) {
            throw new IllegalArgumentException("Schedule job not found:" + jobId);
        }

        assert solverManager != null;
        SolverStatus solverStatus = solverManager.getSolverStatus(jobId);
        boolean isSolving = solverStatus != SolverStatus.NOT_SOLVING;

        // Calculate current score
        assert solutionManager != null;
        solutionManager.update(schedule);

        return  new ScheduleResponse(jobId,
                schedule,
                schedule.getScore(),
                isSolving);
    }

    public void stopSolving(UUID jobId){
        assert solverManager != null;
        solverManager.terminateEarly(jobId);
    }

}
