package dev.ach.dienstplanung.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stations")
public class Station {

    @Id
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "anzahl_benoetigte_mitarbeiter", nullable = false)
    private Integer benoetigteAnzahlMitarbeiter;

    @Column(name = "benoetigte_qualification", nullable = false)
    private String benoetigtQualification;
}
