package dev.ach.dienstplanung.entity;

import dev.ach.dienstplanung.dto.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.DayOfWeek;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "qualification")
    private String qualification;

    @Enumerated(EnumType.STRING)
    @Column(name = "wunsch_schicht")
    private Type wunschSchicht;

    @Column(name = "wochen_stunden")
    private Long wochenStunden;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "bevorzugt_mitarbeiter", columnDefinition = "text[]")
    private List<String> bevorzugtMitarbeiter;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "wunsch_frei_tage", columnDefinition = "text[]")
    private List<DayOfWeek> wunschFreitage;

}
