package dev.ach.dienstplanung.config;


import ai.timefold.solver.core.config.solver.SolverConfig;
import ai.timefold.solver.core.config.solver.termination.TerminationConfig;
import dev.ach.dienstplanung.constraint.Constraints;
import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.planning.Schedule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class TimefoldConfig {
    
    @Bean
    public SolverConfig solverConfig(){
        return new SolverConfig()
                .withSolutionClass(Schedule.class)
                .withEntityClasses(AssignmentDto.class)
                .withConstraintProviderClass(Constraints.class)
                .withTerminationConfig(new TerminationConfig()
                        .withSpentLimit(Duration.ofSeconds(10))
                        .withUnimprovedSpentLimit(Duration.ofSeconds(3)));
    }
}
