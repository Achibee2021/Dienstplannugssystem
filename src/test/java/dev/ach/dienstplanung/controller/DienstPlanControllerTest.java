package dev.ach.dienstplanung.controller;


import dev.ach.dienstplanung.dto.ScheduleResponse;
import dev.ach.dienstplanung.planning.Schedule;
import dev.ach.dienstplanung.service.DienstPlanningsService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(DienstPlanController.class)
public class DienstPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DienstPlanningsService dienstPlanningsService;

    @Test
    void testSolveEndpoint() throws Exception {
        UUID jobId = UUID.randomUUID();
        Mockito.when(dienstPlanningsService.solve())
                .thenReturn(jobId);

        String sampleScheduleJson = """
                {
                    "assignmentList": [],
                    "employeeList": [],
                    "stationList": [],
                    "timeslotList": [],
                }
                """;
        mockMvc.perform(post("/dienstplan/solve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sampleScheduleJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(jobId.toString()));
    }

    @Test
    void testGetScheduleEndpoint() throws  Exception {
        UUID jobId = UUID.randomUUID();
        ScheduleResponse mockResponse = new ScheduleResponse(
                jobId,
                new Schedule(),
                null,
                false
        );

        Mockito.when(dienstPlanningsService.getSchedule(jobId)).thenReturn(mockResponse);

        mockMvc.perform(get("/dienstplan/solve/" + jobId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value(jobId.toString()))
                .andExpect(jsonPath("$.isSolving").value(false));
    }
}
