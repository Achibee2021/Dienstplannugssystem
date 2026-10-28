package dev.ach.dienstplanung.controller;

import dev.ach.dienstplanung.dto.ScheduleResponse;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.service.DienstPlanningsService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DienstPlanControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DienstPlanningsService dienstPlanningsService;

    @InjectMocks
    private DienstPlanController dienstPlanController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(dienstPlanController)
                .build();
    }

    @Test
    void testSolveEndpoint() throws Exception {

        UUID jobId = UUID.randomUUID();

        Mockito.when(dienstPlanningsService.solve())
                .thenReturn(jobId);

        mockMvc.perform(post("/dienstplan/solve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(jobId.toString()));

        Mockito.verify(dienstPlanningsService).solve();
    }

    @Test
    void testGetScheduleEndpoint() throws Exception {

        UUID jobId = UUID.randomUUID();

        ScheduleResponse response = new ScheduleResponse(
                jobId,
                new Schedule(),
                null,
                false
        );

        Mockito.when(
                dienstPlanningsService.getSchedule(jobId)
        ).thenReturn(response);

        mockMvc.perform(
                        get("/dienstplan/solve/" + jobId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId")
                        .value(jobId.toString()))
                .andExpect(jsonPath("$.isSolving")
                        .value(false));

        Mockito.verify(dienstPlanningsService)
                .getSchedule(jobId);
    }
}